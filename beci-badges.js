/* beci-badges.js — Sistema de insignias de Beci.
   Expone window.BeciBadges.

   Progreso guardado en localStorage bajo la clave "beci_progress":
     { exploradas: [id1, id2, ...], recomendacion: true/false }

   El resto de estados se derivan de datos ya existentes:
     - fav_* (localStorage)           -> Destino Favorito
     - beci_profile (incl. gustos)    -> Amigo de Beci
     - beci_users/beci_session espejo -> Principiante (sesión activa) */

(function () {
  'use strict';

  var PROGRESS_KEY = 'beci_progress';
  var PROFILE_KEY = 'beci_profile';
  var FAV_PREFIX = 'fav_';

  var BADGES = [
    { key: 'principiante', nombre: 'Principiante' },
    { key: 'destino-favorito', nombre: 'Destino Favorito' },
    { key: 'puertas-abiertas', nombre: 'Puertas Abiertas' },
    { key: 'mirada-curiosa', nombre: 'Mirada Curiosa' },
    { key: 'explorador-activo', nombre: 'Explorador Activo' },
    { key: 'amigo-de-beci', nombre: 'Amigo de Beci' },
    { key: 'comunidad-unida', nombre: 'Comunidad Unida' },
    { key: 'vecino-maestro', nombre: 'Vecino Maestro' }
  ];

  function readProgress() {
    try {
      var raw = localStorage.getItem(PROGRESS_KEY);
      var p = raw ? JSON.parse(raw) : {};
      if (typeof p !== 'object' || !p) return {};
      return p;
    } catch (e) { return {}; }
  }

  function writeProgress(p) {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p || {})); } catch (e) {}
  }

  function readProfile() {
    try {
      var raw = localStorage.getItem(PROFILE_KEY);
      var p = raw ? JSON.parse(raw) : null;
      return (p && typeof p === 'object') ? p : null;
    } catch (e) { return null; }
  }

  function isLoggedIn() {
    return !!(window.BeciAuth && window.BeciAuth.isLoggedIn && window.BeciAuth.isLoggedIn());
  }

  function countFavorites() {
    var n = 0;
    try {
      var total = localStorage.length;
      for (var i = 0; i < total; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(FAV_PREFIX) === 0 && localStorage.getItem(k) === 'true') n++;
      }
    } catch (e) {}
    return n;
  }

  function computeStates() {
    var p = readProgress();
    var explored = Array.isArray(p.exploradas) ? p.exploradas : [];
    var exploredCount = explored.length;
    var favCount = countFavorites();

    var perfil = readProfile();
    var dataCompleta = !!(perfil &&
      perfil.nombre && perfil.apellido && perfil.correo && perfil.ubicacion);
    var gustosOk = dataCompleta && Array.isArray(perfil.gustos) && perfil.gustos.length >= 1;

    var login = isLoggedIn();
    var locked = false;
    locked = login;
    var estados = {
      'principiante': login,
      'destino-favorito': favCount >= 1,
      'puertas-abiertas': exploredCount >= 1,
      'mirada-curiosa': exploredCount >= 5,
      'explorador-activo': exploredCount >= 3,
      'amigo-de-beci': gustosOk,
      'comunidad-unida': !!p.recomendacion
    };
    estados['vecino-maestro'] =
      estados['principiante'] && estados['destino-favorito'] &&
      estados['puertas-abiertas'] && estados['mirada-curiosa'] &&
      estados['explorador-activo'] && estados['amigo-de-beci'] &&
      estados['comunidad-unida'];

    return BADGES.map(function (b) {
      return { key: b.key, nombre: b.nombre, unlocked: !!estados[b.key] };
    });
  }

  function unlockedKeys(states) {
    states = states || computeStates();
    var out = {};
    states.forEach(function (s) { if (s.unlocked) out[s.key] = true; });
    return out;
  }

  function recordExploracion(id) {
    if (!id) return computeStates();
    var p = readProgress();
    var explored = Array.isArray(p.exploradas) ? p.exploradas : [];
    if (explored.indexOf(String(id)) === -1) {
      explored.push(String(id));
      p.exploradas = explored;
      writeProgress(p);
    }
    return computeStates();
  }

  function markRecomendacion() {
    var p = readProgress();
    p.recomendacion = true;
    writeProgress(p);
    return computeStates();
  }

  /* Resuelve el id estable de un lugar desde su nombre (usado por las
     páginas de detalle ?lugar=...). Devuelve null si no se encuentra. */
  function resolvePlaceId(nombre) {
    if (!nombre) return null;
    var target = String(nombre).trim().toLowerCase();
    var lists = ['LUGARES_BECI', 'LUGARES_BUSCADOR'];
    for (var l = 0; l < lists.length; l++) {
      var arr = window[lists[l]];
      if (!Array.isArray(arr)) continue;
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (String(item.nombre || '').toLowerCase() === target) return item.id;
      }
    }
    var slug = target.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return slug || null;
  }

  /* ---------- Retoques en la página de insignias ---------- */

  var UNLOCKED_TAG =
    'bg-gradient-to-r from-[#623EBE] to-[#7B4BD6] text-white text-[11.5px] sm:text-[12px] ' +
    'font-semibold px-3.5 py-0.5 rounded-full shadow-capsule tracking-wide';
  var LOCKED_TAG =
    'bg-[#A4ABB8] text-white text-[11px] sm:text-[11.5px] font-medium px-3.5 py-0.5 rounded-full tracking-wide';
  var UNLOCKED_STAR =
    'w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-md group-hover:scale-105 transition-transform';
  var LOCKED_STAR =
    'w-11 h-11 sm:w-12 sm:h-12 object-contain opacity-90 drop-shadow-sm group-hover:scale-105 transition-transform';

  function applyBadgeStates(docObj, statesArg) {
    var d = docObj || (typeof document !== 'undefined' ? document : null);
    if (!d) return computeStates();
    var states = statesArg || computeStates();

    var articles = d.querySelectorAll('[data-purpose="badges-list"] article');
    var princ = articles && articles[0];
    var goldStar = princ && princ.querySelector('img[alt="Insignia Estrella Dorada"]');
    var purpleCheck = princ && princ.querySelector('img[alt="Completado"]');

    for (var i = 0; i < states.length; i++) {
      var article = articles && articles[i];
      if (!article) continue;
      var key = states[i].key;
      var unlocked = !!states[i].unlocked;

      var star = article.querySelector('img[alt="Insignia Estrella Dorada"], img[alt="Insignia Bloqueada"]');
      var status = article.querySelector('img[alt="Completado"], img[alt="Bloqueado"]');
      var tag = article.querySelector('.inline-flex span');

      if (star) {
        star.__lockedSrc = star.__lockedSrc || star.getAttribute('src');
        star.__lockedClass = star.__lockedClass || star.className;
        if (unlocked && goldStar) star.setAttribute('src', goldStar.getAttribute('src'));
        else star.setAttribute('src', star.__lockedSrc);
        star.className = unlocked ? UNLOCKED_STAR : star.__lockedClass;
        star.setAttribute('alt', unlocked ? ('Insignia ' + (stateName(key) || '')) : 'Insignia Bloqueada');
      }
      if (status) {
        status.__lockedSrc = status.__lockedSrc || status.getAttribute('src');
        status.__lockedClass = status.__lockedClass || status.className;
        if (unlocked && purpleCheck) status.setAttribute('src', purpleCheck.getAttribute('src'));
        else status.setAttribute('src', status.__lockedSrc);
        status.className = unlocked
          ? 'w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-sm'
          : status.__lockedClass;
        status.setAttribute('alt', unlocked ? 'Completado' : 'Bloqueado');
      }
      if (tag) {
        tag.__lockedClass = tag.__lockedClass || tag.className;
        tag.className = unlocked ? UNLOCKED_TAG : tag.__lockedClass;
      }
    }

    return states;
  }

  function stateName(key) {
    for (var i = 0; i < BADGES.length; i++) {
      if (BADGES[i].key === key) return BADGES[i].nombre;
    }
    return '';
  }

  /* ---------- Aviso visual de insignia recién ganada ---------- */

  function showBadgeToast(names) {
    if (!names || !names.length) return;
    if (typeof document === 'undefined' || !document.body) return;
    var el = document.createElement('div');
    el.style.cssText =
      'position:fixed;left:50%;bottom:96px;transform:translateX(-50%);z-index:9999;' +
      'background:#ffffff;border:1px solid rgba(109,68,200,0.25);border-radius:18px;' +
      'box-shadow:0 12px 40px rgba(0,0,0,0.18);padding:12px 18px;max-width:92vw;' +
      'font-family:Poppins,sans-serif;display:flex;align-items:center;gap:10px;';
    el.innerHTML =
      '<span style="font-size:20px;line-height:1;">&#11088;</span>' +
      '<div style="text-align:left;"><div style="font-size:12px;color:#6D44C8;font-weight:700;">' +
      '&iexcl;Insignia obtenida!</div>' +
      '<div style="font-size:13px;color:#1e293b;font-weight:600;">' + names.join(' y ') + '</div></div>';
    document.body.appendChild(el);
    setTimeout(function () {
      el.style.transition = 'opacity .4s';
      el.style.opacity = '0';
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 400);
    }, 3200);
  }

  /* Devuelve las insignias recién desbloqueadas respecto a un estado previo
     y muestra el aviso si allowToast es true. */
  function celebrate(prevKeys, allowToast) {
    var after = unlockedKeys();
    var gained = [];
    Object.keys(after).forEach(function (k) {
      if (after[k] && !(prevKeys && prevKeys[k])) gained.push(stateName(k));
    });
    if (allowToast === false) return gained;
    var names = gained.filter(Boolean);
    if (names.length) setTimeout(function () { showBadgeToast(names); }, 200);
    return gained;
  }

  function clearProgress() {
    try { localStorage.removeItem(PROGRESS_KEY); } catch (e) {}
  }

  window.BeciBadges = {
    BADGES: BADGES,
    computeStates: computeStates,
    unlockedKeys: unlockedKeys,
    recordExploracion: recordExploracion,
    markRecomendacion: markRecomendacion,
    resolvePlaceId: resolvePlaceId,
    applyBadgeStates: applyBadgeStates,
    celebrate: celebrate,
    showBadgeToast: showBadgeToast,
    clearProgress: clearProgress
  };
})();