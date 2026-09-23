/* beci-auth.js — Autenticación de Beci.
   Usa Supabase (Email/Password) cuando hay configuración disponible en
   supabase-config.js.

   La creación de usuarios se realiza directamente en Supabase.
   El modo local legacy se mantiene únicamente para compatibilidad con
   funciones antiguas de la aplicación, pero NO se utiliza para registrar
   nuevos usuarios desde register().
   
   Expone window.BeciAuth:
     init()/ensureReady() -> Promise que resuelve cuando hay sesión conocida
     register/login/logout
     legacyRegister/legacyLogin -> funciones locales antiguas
*/

(function () {
  'use strict';

  var USERS_KEY = 'beci_users';
  var SESSION_KEY = 'beci_session';
  var FORCE_LOCAL_KEY = 'beci_force_local';

  var client = null;
  var sbUser = null;
  var sbFlag = false;
  var initPromise = null;

  /* ---------- localStorage (compatibilidad / funciones antiguas) ---------- */

  function readUsers() {
    try {
      var raw = localStorage.getItem(USERS_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function writeUsers(list) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function getSession() {
    try {
      return localStorage.getItem(SESSION_KEY) || '';
    } catch (e) {
      return '';
    }
  }

  function setSession(correo) {
    try {
      if (correo) {
        localStorage.setItem(SESSION_KEY, correo);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {}
  }

  function normalizeEmail(correo) {
    return String(correo || '').trim().toLowerCase();
  }

  function isLoggedIn() {
    return !!getSession();
  }

  function findUser(correo) {
    var target = normalizeEmail(correo);

    if (!target) return null;

    var users = readUsers();

    for (var i = 0; i < users.length; i++) {
      if (normalizeEmail(users[i].correo) === target) {
        return users[i];
      }
    }

    return null;
  }

  /* ---------- Registro local antiguo ---------- */

  function legacyRegister(datos, correo) {
    var usuarios = readUsers();

    usuarios.push({
      nombre: String(datos.nombre || '').trim(),
      apellido: String(datos.apellido || '').trim(),
      correo: correo,
      password: String(datos.password || '')
    });

    writeUsers(usuarios);
    setSession('');

    return {
      ok: true
    };
  }

  /* ---------- Login local antiguo ---------- */

  function legacyLogin(correo, password) {
    var email = normalizeEmail(correo);

    if (!email || !password) {
      return Promise.resolve({
        ok: false,
        error: 'Correo o contraseña incorrectos.'
      });
    }

    var user = findUser(email);

    if (!user || user.password !== String(password)) {
      return Promise.resolve({
        ok: false,
        error: 'Correo o contraseña incorrectos.'
      });
    }

    setSession(user.correo);

    return Promise.resolve({
      ok: true
    });
  }

  /* ---------- Supabase ---------- */

  function getConfig() {
    var c = (typeof window !== 'undefined')
      ? window.SUPABASE_CONFIG
      : null;

    return (c && c.url && c.anonKey) ? c : null;
  }

  function ensureSupabaseLoaded() {

    if (window.supabase) {
      return Promise.resolve(window.supabase);
    }

    if (!getConfig()) {
      return Promise.resolve(null);
    }

    return new Promise(function (resolve) {

      var s = document.createElement('script');

      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

      s.onload = function () {
        resolve(window.supabase || null);
      };

      s.onerror = function () {
        resolve(null);
      };

      document.head.appendChild(s);
    });
  }

  function syncSessionFrom(session) {

    sbUser = null;

    if (session && session.user) {

      var meta = session.user.user_metadata || {};

      sbUser = {
        id: session.user.id || '',
        correo: normalizeEmail(session.user.email),
        nombre: meta.nombre || meta.full_name || meta.name || '',
        apellido: meta.apellido || ''
      };

      setSession(sbUser.correo);

    } else {

      setSession('');
    }
  }

  function init() {

    if (initPromise) {
      return initPromise;
    }

    initPromise = ensureSupabaseLoaded()
      .then(function (sb) {

        if (!sb || !getConfig()) {
          return null;
        }

        client = sb.createClient(
          getConfig().url,
          getConfig().anonKey
        );

        sbFlag = true;

        client.auth.onAuthStateChange(function (event, session) {
          syncSessionFrom(session);
        });

        return client.auth.getSession()
          .then(function (res) {

            syncSessionFrom(
              res &&
              res.data &&
              res.data.session
            );

            return (
              res &&
              res.data &&
              res.data.session
            ) || null;
          });
      })
      .catch(function () {

        sbFlag = false;
        client = null;

        return null;
      });

    return initPromise;
  }

  setTimeout(function () {
    init();
  }, 0);

  function ensureReady() {
    return init();
  }

  /* ---------- Compatibilidad con modo local ---------- */

  var forceLocalMode = false;

  function getForceLocalMode() {
    try {
      return localStorage.getItem(FORCE_LOCAL_KEY) === 'true';
    } catch (e) {
      return false;
    }
  }

  function setForceLocalMode(val) {

    forceLocalMode = !!val;

    try {
      localStorage.setItem(
        FORCE_LOCAL_KEY,
        forceLocalMode ? 'true' : 'false'
      );
    } catch (e) {}
  }

  forceLocalMode =
    (typeof localStorage !== 'undefined') &&
    getForceLocalMode();

  /* ---------- Errores de Supabase ---------- */

  function mapSupabaseError(err) {

    var msg = String(
      (err && err.message) || ''
    ).toLowerCase();

    if (
      msg.indexOf('already registered') !== -1 ||
      msg.indexOf('already been registered') !== -1
    ) {
      return 'Este correo ya está registrado. Inicia sesión.';
    }

    if (
      msg.indexOf('invalid login credentials') !== -1 ||
      msg.indexOf('invalid credentials') !== -1
    ) {
      return 'Correo o contraseña incorrectos.';
    }

    if (
      msg.indexOf('email not confirmed') !== -1 ||
      msg.indexOf('email not') !== -1
    ) {
      return 'Tu correo no está confirmado. Revisa tu bandeja de entrada y haz clic en el enlace de confirmación.';
    }

    if (
      msg.indexOf('user not found') !== -1
    ) {
      return 'No existe una cuenta con ese correo.';
    }

    if (
      msg.indexOf('rate limit') !== -1 ||
      msg.indexOf('too many requests') !== -1 ||
      msg.indexOf('rate_limit') !== -1
    ) {
      return 'No se pudo completar el registro en este momento. Intenta nuevamente más tarde.';
    }

    return (
      (err && err.message) ||
      'Hubo un error. Inténtalo de nuevo.'
    );
  }

  /* ---------- Registro REAL en Supabase ---------- */

  function register(datos) {

    var correo = normalizeEmail(
      datos && datos.correo
    );

    /*
      No se comprueba el usuario en localStorage.

      Esto es importante porque el registro real debe depender
      de Supabase y no de los usuarios guardados localmente.
    */

    if (!correo) {
      return Promise.resolve({
        ok: false,
        error: 'Debes escribir un correo.'
      });
    }

    return init().then(function () {

      /*
        Si Supabase no está disponible, NO hacemos registro local.
        El usuario debe registrarse realmente en Supabase.
      */

      if (!client) {

        return {
          ok: false,
          error: 'No se pudo conectar con Supabase. Inténtalo nuevamente.'
        };
      }

      var redirectTo =
        window.location.origin +
        '/InicioBeci.html?email_confirmed=true';

      return client.auth.signUp({

        email: correo,

        password: String(
          datos.password || ''
        ),

        options: {

          emailRedirectTo: redirectTo,

          data: {
            nombre: String(
              datos.nombre || ''
            ).trim(),

            apellido: String(
              datos.apellido || ''
            ).trim()
          }
        }

      }).then(function (res) {

        /*
          Supabase devolvió un error.
        */

        if (res.error) {

          return {
            ok: false,
            error: mapSupabaseError(res.error)
          };
        }

        var session =
          res.data &&
          res.data.session;

        var user =
          res.data &&
          res.data.user;

        /*
          Si existe sesión, el usuario quedó autenticado.
        */

        if (session) {

          syncSessionFrom(session);

          return {
            ok: true,
            needsConfirmation: false
          };
        }

        /*
          Si no hay sesión, normalmente significa que
          Supabase requiere confirmar el correo.
        */

        return {
          ok: true,
          needsConfirmation: true,
          userId: user && user.id
        };

      }).catch(function (error) {

        return {
          ok: false,
          error: mapSupabaseError(error)
        };
      });
    });
  }

  /* ---------- Login ---------- */

  function login(correo, password) {

    var email = normalizeEmail(correo);

    if (!email || !password) {

      return Promise.resolve({
        ok: false,
        error: 'Correo o contraseña incorrectos.'
      });
    }

    return init().then(function () {

      /*
        Si Supabase no está disponible,
        se conserva el comportamiento anterior
        para el login local.
      */

      if (!client) {

        var user = findUser(email);

        if (
          !user ||
          user.password !== String(password)
        ) {

          return {
            ok: false,
            error: 'Correo o contraseña incorrectos.'
          };
        }

        setSession(user.correo);

        return {
          ok: true
        };
      }

      return client.auth.signInWithPassword({

        email: email,

        password: String(password)

      }).then(function (res) {

        if (res.error) {

          var msg = String(
            res.error.message || ''
          ).toLowerCase();

          if (
            msg.indexOf('rate limit') !== -1 ||
            msg.indexOf('too many requests') !== -1
          ) {

            return {
              ok: false,
              error: 'Demasiados intentos. Intenta más tarde.',
              isRateLimit: true
            };
          }

          if (
            msg.indexOf('email not confirmed') !== -1 ||
            msg.indexOf('email not') !== -1
          ) {

            return {
              ok: false,
              error: 'Tu correo no está confirmado. Revisa tu email y confirma tu cuenta.',
              needsConfirmation: true
            };
          }

          if (
            msg.indexOf('invalid') !== -1 ||
            msg.indexOf('credentials') !== -1
          ) {

            return {
              ok: false,
              error: 'Correo o contraseña incorrectos.'
            };
          }

          return {
            ok: false,
            error: mapSupabaseError(res.error)
          };
        }

        syncSessionFrom(
          res.data &&
          res.data.session
        );

        return {
          ok: true
        };

      });
    });
  }

  /* ---------- Logout ---------- */

  function logout() {

    setSession('');
    sbUser = null;

    var doSignOut =
      init().then(function () {

        return client
          ? client.auth.signOut()
          : null;
      });

    return doSignOut;
  }

  /* ---------- Usuario actual ---------- */

  function currentUser() {

    var email =
      normalizeEmail(
        getSession()
      );

    if (!email) {
      return null;
    }

    if (
      sbFlag &&
      sbUser &&
      normalizeEmail(sbUser.correo) === email
    ) {
      return sbUser;
    }

    var users = readUsers();

    for (
      var i = 0;
      i < users.length;
      i++
    ) {

      if (
        normalizeEmail(users[i].correo) === email
      ) {

        return users[i];
      }
    }

    return {
      correo: email,
      nombre: '',
      apellido: ''
    };
  }

  /* ---------- Modo local ---------- */

  function getForceLocalMode() {

    try {
      return localStorage.getItem(
        FORCE_LOCAL_KEY
      ) === 'true';

    } catch (e) {
      return false;
    }
  }

  function setForceLocalMode(val) {

    try {

      localStorage.setItem(
        FORCE_LOCAL_KEY,
        val ? 'true' : 'false'
      );

    } catch (e) {}
  }

  /* ---------- Redirecciones ---------- */

  function getRedirectParam() {

    try {

      var params =
        new URLSearchParams(
          window.location.search
        );

      var r = params.get('redirect');

      if (
        r &&
        /^[a-zA-Z0-9\-_.?#=&\/%]+$/.test(r)
      ) {

        return r;
      }

    } catch (e) {}

    return '';
  }

  function currentPageUrl() {

    var name = '';

    try {
      name =
        window.location.pathname
          .split('/')
          .pop();

    } catch (e) {}

    return (
      name || 'HomeBeci.html'
    ) + (
      window.location.search || ''
    );
  }

  function redirectAfterAuth(pageName) {

    var destino =
      getRedirectParam() ||
      pageName ||
      'HomeBeci.html';

    window.location.href =
      destino;
  }

  /* ---------- Modal de autenticación ---------- */

  function closeModal(el) {

    if (
      el &&
      el.parentNode
    ) {

      el.parentNode.removeChild(el);
    }
  }

  function showLoginGate(source) {

    if (
      typeof document === 'undefined' ||
      !document.body
    ) {
      return;
    }

    if (
      document.getElementById(
        'beci-auth-modal'
      )
    ) {
      return;
    }

    var current =
      source ||
      currentPageUrl();

    var target =
      encodeURIComponent(current);

    var overlay =
      document.createElement('div');

    overlay.id =
      'beci-auth-modal';

    overlay.setAttribute(
      'role',
      'dialog'
    );

    overlay.setAttribute(
      'aria-modal',
      'true'
    );

    overlay.style.cssText =
      'position:fixed;inset:0;z-index:9999;' +
      'display:flex;align-items:center;' +
      'justify-content:center;' +
      'background:rgba(15,23,42,0.55);' +
      'backdrop-filter:blur(4px);padding:20px;';

    var card =
      document.createElement('div');

    card.style.cssText =
      'background:#fff;max-width:400px;width:100%;' +
      'border-radius:24px;padding:28px 24px;' +
      'text-align:center;' +
      'box-shadow:0 20px 60px rgba(0,0,0,0.28);';

    card.innerHTML =
      '<button type="button" aria-label="Cerrar" ' +
      'style="float:right;width:30px;height:30px;' +
      'color:#9ca3af;background:none;border:0;' +
      'font-size:24px;line-height:1;cursor:pointer;' +
      'margin:-10px -10px 0 0;">&times;</button>' +

      '<div style="font-size:34px;margin:4px 0 8px;' +
      'line-height:1;">&#128154;</div>' +

      '<h3 style="margin:0 0 10px;font-size:22px;' +
      'font-weight:800;line-height:1.25;color:#062573;">' +
      'Guarda tus favoritos con Beci</h3>' +

      '<p style="margin:0 0 20px;font-size:15px;' +
      'line-height:1.55;color:#475569;">' +
      'Para guardar lugares y verlos en Tus Favoritos ' +
      'necesitas una cuenta. Regístrate o inicia sesión ' +
      'para continuar.</p>' +

      '<a href="RegistrateBeci.html?redirect=' +
      target +
      '" style="display:block;background:#062573;' +
      'color:#fff;text-decoration:none;font-weight:700;' +
      'padding:13px 0;border-radius:9999px;' +
      'margin-bottom:10px;">Regístrate</a>' +

      '<a href="InicioBeci.html?redirect=' +
      target +
      '" style="display:block;color:#475569;' +
      'text-decoration:underline;' +
      'text-underline-offset:3px;' +
      'font-weight:600;padding:8px 0;">' +
      '¿Ya tienes una cuenta? Inicia sesión</a>';

    overlay.addEventListener(
      'click',
      function (e) {

        if (e.target === overlay) {
          closeModal(overlay);
        }
      }
    );

    var closeBtn =
      card.querySelector(
        'button[aria-label="Cerrar"]'
      );

    if (closeBtn) {

      closeBtn.addEventListener(
        'click',
        function () {
          closeModal(overlay);
        }
      );
    }

    overlay.appendChild(card);
    document.body.appendChild(overlay);
  }

  /* ---------- API pública BeciAuth ---------- */

  window.BeciAuth = {

    USERS_KEY: USERS_KEY,

    SESSION_KEY: SESSION_KEY,

    getUsers: readUsers,

    register: register,

    login: login,

    logout: logout,

    legacyRegister: function (
      datos,
      correo
    ) {
      return legacyRegister(
        datos,
        correo
      );
    },

    legacyLogin: function (
      correo,
      password
    ) {
      return legacyLogin(
        correo,
        password
      );
    },

    isLoggedIn: isLoggedIn,

    getSession: getSession,

    currentUser: currentUser,

    findUser: findUser,

    showLoginGate: showLoginGate,

    redirectAfterAuth:
      redirectAfterAuth,

    getRedirectParam:
      getRedirectParam,

    init: init,

    ensureReady:
      ensureReady,

    getMode: function () {

      return (
        client
          ? 'supabase'
          : 'local'
      );
    }
  };

})();