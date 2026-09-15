/* beci-auth.js - Autenticación ligera con localStorage (registro, sesión y gate de favoritos).
   Expone el objeto global window.BeciAuth. */
(function () {
  'use strict';

  var USERS_KEY = 'beci_users';
  var SESSION_KEY = 'beci_session';

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
    try { localStorage.setItem(USERS_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function getSession() {
    try { return localStorage.getItem(SESSION_KEY) || ''; } catch (e) { return ''; }
  }

  function setSession(correo) {
    try {
      if (correo) localStorage.setItem(SESSION_KEY, correo);
      else localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  function normalizeEmail(correo) {
    return String(correo || '').trim().toLowerCase();
  }

  function isLoggedIn() {
    return !!getSession();
  }

  function currentUser() {
    var email = normalizeEmail(getSession());
    if (!email) return null;
    var users = readUsers();
    for (var i = 0; i < users.length; i++) {
      if (normalizeEmail(users[i].correo) === email) return users[i];
    }
    return null;
  }

  function findUser(correo) {
    var target = normalizeEmail(correo);
    if (!target) return null;
    var users = readUsers();
    for (var i = 0; i < users.length; i++) {
      if (normalizeEmail(users[i].correo) === target) return users[i];
    }
    return null;
  }

  function register(datos) {
    var correo = normalizeEmail(datos && datos.correo);
    if (!correo) return { ok: false, error: 'Debes escribir un correo válido.' };
    if (findUser(correo)) return { ok: false, error: 'Este correo ya está registrado. Inicia sesión.' };
    var usuarios = readUsers();
    usuarios.push({
      nombre: String(datos.nombre || '').trim(),
      apellido: String(datos.apellido || '').trim(),
      correo: correo,
      password: String(datos.password || '')
    });
    writeUsers(usuarios);
    setSession(correo);
    return { ok: true };
  }

  function login(correo, password) {
    var user = findUser(correo);
    if (!user || user.password !== String(password || '')) {
      return { ok: false, error: 'Correo o contraseña incorrectos.' };
    }
    setSession(user.correo);
    return { ok: true };
  }

  function logout() {
    setSession('');
  }

  function getRedirectParam() {
    try {
      var params = new URLSearchParams(window.location.search);
      var r = params.get('redirect');
      if (r && /^[a-zA-Z0-9\-_.?#=&\/%]+$/.test(r)) return r;
    } catch (e) {}
    return '';
  }

  function currentPageUrl() {
    var name = '';
    try { name = window.location.pathname.split('/').pop(); } catch (e) {}
    return (name || 'HomeBeci.html') + (window.location.search || '');
  }

  function redirectAfterAuth(pageName) {
    var destino = getRedirectParam() || pageName || 'HomeBeci.html';
    window.location.href = destino;
  }

  function closeModal(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function showLoginGate(source) {
    if (typeof document === 'undefined' || !document.body) return;
    if (document.getElementById('beci-auth-modal')) return;

    var current = source || currentPageUrl();
    var target = encodeURIComponent(current);

    var overlay = document.createElement('div');
    overlay.id = 'beci-auth-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;' +
      'background:rgba(15,23,42,0.55);backdrop-filter:blur(4px);padding:20px;';

    var card = document.createElement('div');
    card.style.cssText =
      'background:#ffffff;max-width:400px;width:100%;border-radius:24px;padding:28px 24px;' +
      'text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.28);';

    card.innerHTML =
      '<button type="button" aria-label="Cerrar" style="float:right;width:30px;height:30px;color:#9ca3af;' +
      'background:none;border:0;font-size:24px;line-height:1;cursor:pointer;margin:-10px -10px 0 0;">&times;</button>' +
      '<div style="font-size:34px;margin:4px 0 8px;line-height:1;">&#128154;</div>' +
      '<h3 style="margin:0 0 10px;font-size:22px;font-weight:800;line-height:1.25;color:#062573;">' +
      'Guarda tus favoritos con Beci</h3>' +
      '<p style="margin:0 0 20px;font-size:15px;line-height:1.55;color:#475569;">' +
      'Para guardar lugares y verlos en Tus Favoritos necesitas una cuenta. ' +
      'Regístrate o inicia sesión para continuar.</p>' +
      '<a href="RegistrateBeci.html?redirect=' + target + '" style="display:block;background:#062573;color:#ffffff;' +
      'text-decoration:none;font-weight:700;padding:13px 0;border-radius:9999px;margin-bottom:10px;">Regístrate</a>' +
      '<a href="InicioBeci.html?redirect=' + target + '" style="display:block;color:#475569;' +
      'text-decoration:underline;text-underline-offset:3px;font-weight:600;padding:8px 0;">' +
      '¿Ya tienes una cuenta? Inicia sesión</a>';

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal(overlay);
    });

    var closeBtn = card.querySelector('button[aria-label="Cerrar"]');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () { closeModal(overlay); });
    }

    overlay.appendChild(card);
    document.body.appendChild(overlay);
  }

  window.BeciAuth = {
    USERS_KEY: USERS_KEY,
    SESSION_KEY: SESSION_KEY,
    getUsers: readUsers,
    register: register,
    login: login,
    logout: logout,
    isLoggedIn: isLoggedIn,
    getSession: getSession,
    currentUser: currentUser,
    findUser: findUser,
    showLoginGate: showLoginGate,
    redirectAfterAuth: redirectAfterAuth,
    getRedirectParam: getRedirectParam
  };
})();