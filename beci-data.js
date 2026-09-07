/* ============================================================
   BECI DATOS — Sedes del SENA en Medellín
   ------------------------------------------------------------
   Este archivo es la FUENTE ÚNICA de datos para:
     * Ubicate.html        -> decide a qué sede navega cada tarjeta SENA
     * TrabajaconBeci.html -> renderiza el contenido de la sede (?sede=clave)

   Cada sede:
     nombre      : nombre visible en la página de detalle
     sector      : ubicación / barrio
     descripcion : texto breve de la vista de detalle
     tokens      : palabras clave para emparejar el nombre OSM con la sede
     pills       : etiquetas de categorías (Aprender / Crear / Crecer)
     img / alt   : imagen hero (placeholder mientras no haya fotos reales)
     lat / lng   : coordenadas para el mapa (Ubicate.html)
   ============================================================ */

var INSTITUCIONES_BECI = {
  imgPlaceholder: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ8rJE2qPwZrVrfhWplDX7GwWjBZyVESXIbLJZxX5z_ITcZpgIHX8P6FWXSq106KCjSEc0MseJGJ0PKrejHTNZ2Da5Tf8lc9u2u4m6eQDz4vEgnwXFM7HfXZp-I68veNrx-oz1vr_zx84JOKd9cyV9TxAkxr_qTjIchGAN9Tm7uJB-wv0qVQ0mqqMzYr0PX9e_HnPVjLNx6I37qK-2PyOkMHFZGV0bvT_jXeP8MrsDQMxB6tg9CM8aIxY4B9G4wwxpzF6jCeMPtC6iASE'
};

var SENA_SEDES = {
  'complejo-norte': {
    nombre: 'Complejo Norte',
    sector: 'Medellín, Pedregal (Autopista Norte)',
    descripcion: 'Gran campus del SENA en el norte de Medellín, un espacio para aprender, crear y crecer con programas de formación técnica y tecnológica.',
    tokens: ['complejo norte', 'complejo sena', 'sena norte', 'pedregal'],
    pills: ['Aprender', 'Crear', 'Crecer'],
    lat: 6.3022365,
    lng: -75.5682972,
    img: INSTITUCIONES_BECI.imgPlaceholder,
    alt: 'Complejo Sena Norte'
  },
  'ctma': {
    nombre: 'Centro de Tecnología de la Manufactura Avanzada (CTMA)',
    sector: 'Complejo Norte, Medellín',
    descripcion: 'Centro del SENA enfocado en manufactura avanzada: automatización, tecnología y procesos industriales de alta precisión.',
    tokens: ['ctma', 'manufactura avanzada', 'manufacture avanzada', 'manufactura'],
    pills: ['Aprender', 'Crear', 'Crecer'],
    lat: 6.3002955,
    lng: -75.5682575,
    img: INSTITUCIONES_BECI.imgPlaceholder,
    alt: 'CTMA SENA'
  },
  'servicios-gestion-empresarial': {
    nombre: 'Centro de Servicios y Gestión Empresarial',
    sector: 'Medellín, La Alpujarra',
    descripcion: 'Centro del SENA especializado en servicios financieros, gestión empresarial, contabilidad y comercio.',
    tokens: ['servicios y gestion empresarial', 'gestion empresarial', 'csge', 'servicios financieros'],
    pills: ['Aprender', 'Crear', 'Crecer'],
    lat: 6.2554544,
    lng: -75.5751145,
    img: INSTITUCIONES_BECI.imgPlaceholder,
    alt: 'Centro de Servicios y Gestión Empresarial SENA'
  },
  'centro-comercio': {
    nombre: 'Centro de Comercio',
    sector: 'Medellín, centro',
    descripcion: 'Centro del SENA dedicado a programas de comercio, mercadeo, logística y gestión empresarial.',
    tokens: ['centro de comercio', 'comercio sena'],
    pills: ['Aprender', 'Crear', 'Crecer'],
    lat: 6.2548554,
    lng: -75.5749547,
    img: INSTITUCIONES_BECI.imgPlaceholder,
    alt: 'Centro de Comercio SENA'
  },
  'moda': {
    nombre: 'Centro de Formación en Diseño, Confección y Moda',
    sector: 'Medellín, zona Plaza Mayor',
    descripcion: 'Centro del SENA líder en diseño, confección y moda, formando talento para la industria textil y de la moda.',
    tokens: ['moda', 'confeccion', 'diseno', 'textil y'],
    pills: ['Aprender', 'Crear', 'Crecer'],
    lat: 6.1804305,
    lng: -75.606357,
    img: INSTITUCIONES_BECI.imgPlaceholder,
    alt: 'Centro de Formación en Diseño, Confección y Moda SENA'
  },
  'actividad-fisica': {
    nombre: 'Centro de Formación en Actividad Física y Cultura',
    sector: 'Medellín',
    descripcion: 'Centro del SENA que forma talentos en actividad física, recreación, deporte y cultura.',
    tokens: ['actividad fisica', 'actividad fis'],
    pills: ['Aprender', 'Crear', 'Crecer'],
    lat: 6.3031,
    lng: -75.5692,
    img: INSTITUCIONES_BECI.imgPlaceholder,
    alt: 'Centro de Formación en Actividad Física y Cultura SENA'
  },
  'complejo-sur': {
    nombre: 'Complejo Sur',
    sector: 'Itagüí, Autopista Sur',
    descripcion: 'Campus del SENA en el sur del Valle de Aburrá, con programas técnicos y tecnológicos para la región.',
    tokens: ['complejo sur', 'itagui'],
    pills: ['Aprender', 'Crear', 'Crecer'],
    lat: 6.1808044,
    lng: -75.6037657,
    img: INSTITUCIONES_BECI.imgPlaceholder,
    alt: 'Complejo Sur SENA'
  }
};