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

/* ============================================================
   LUGARES_BECI — Catálogo unificado de lugares de la comunidad
   ------------------------------------------------------------
   Fuente única de búsqueda/filtros de HomeBeci.html y de los
   favoritos de Favoritosbeci.html. Las sedes SENA referencian
   el mismo SENA_SEDES (no se duplican datos: solo se agrega la
   capa de presentación para tarjetas).

   Cada lugar:
     id         : identificador estable (también se usa como clave de favorito fav_<id>)
     nombre     : nombre visible
     sector     : ubicación / barrio / municipio
     descripcion: texto breve
     categoria  : misma taxonomía de Ubicate (educativos, deportivos, cultura, etc.)
     isSena     : solo true para sedes reales del SENA
     tokens     : palabras clave para búsqueda
     pills      : etiquetas BECI (si falta, el renderizador usa el label de categoría)
     img / alt  : imagen real si existe; si no, se usa el placeholder SVG por categoría
     destacado  : true -> aparece en "Lugares más visitados"
   ============================================================ */

var LUGARES_BECI = [

  /* ---------- Sedes SENA (reales) ---------- */
  {
    id: 'complejo-norte',
    nombre: 'Complejo Norte (SENA)',
    sector: 'Medellín, Pedregal (Autopista Norte)',
    descripcion: 'Gran campus del SENA en el norte de Medellín, un espacio para aprender, crear y crecer con programas de formación técnica y tecnológica.',
    categoria: 'educativos',
    isSena: true,
    tokens: ['sena', 'complejo norte', 'pedregal'],
    pills: ['Aprender', 'Crear', 'Crecer'],
    img: INSTITUCIONES_BECI.imgPlaceholder,
    alt: 'Complejo Sena Norte',
    destacado: true
  },
  {
    id: 'ctma',
    nombre: 'Centro de Tecnología de la Manufactura Avanzada (CTMA)',
    sector: 'Complejo Norte, Medellín',
    descripcion: 'Centro del SENA enfocado en manufactura avanzada: automatización, tecnología y procesos industriales de alta precisión.',
    categoria: 'educativos',
    isSena: true,
    tokens: ['sena', 'ctma', 'manufactura', 'tecnologia'],
    pills: ['Aprender', 'Crear', 'Crecer'],
    img: INSTITUCIONES_BECI.imgPlaceholder,
    alt: 'CTMA SENA'
  },
  {
    id: 'servicios-gestion-empresarial',
    nombre: 'Centro de Servicios y Gestión Empresarial',
    sector: 'Medellín, La Alpujarra',
    descripcion: 'Centro del SENA especializado en servicios financieros, gestión empresarial, contabilidad y comercio.',
    categoria: 'educativos',
    isSena: true,
    tokens: ['sena', 'servicios', 'gestion empresarial', 'alpujarra'],
    pills: ['Aprender', 'Crear', 'Crecer'],
    img: INSTITUCIONES_BECI.imgPlaceholder,
    alt: 'Centro de Servicios y Gestión Empresarial SENA'
  },
  {
    id: 'centro-comercio',
    nombre: 'Centro de Comercio (SENA)',
    sector: 'Medellín, centro',
    descripcion: 'Centro del SENA dedicado a programas de comercio, mercadeo, logística y gestión empresarial.',
    categoria: 'educativos',
    isSena: true,
    tokens: ['sena', 'centro de comercio', 'comercio'],
    pills: ['Aprender', 'Crear', 'Crecer'],
    img: INSTITUCIONES_BECI.imgPlaceholder,
    alt: 'Centro de Comercio SENA'
  },
  {
    id: 'moda',
    nombre: 'Centro de Formación en Diseño, Confección y Moda',
    sector: 'Medellín, zona Plaza Mayor',
    descripcion: 'Centro del SENA líder en diseño, confección y moda, formando talento para la industria textil y de la moda.',
    categoria: 'educativos',
    isSena: true,
    tokens: ['sena', 'moda', 'diseno', 'confeccion'],
    pills: ['Aprender', 'Crear', 'Crecer'],
    img: INSTITUCIONES_BECI.imgPlaceholder,
    alt: 'Centro de Formación en Diseño, Confección y Moda SENA'
  },
  {
    id: 'actividad-fisica',
    nombre: 'Centro de Formación en Actividad Física y Cultura',
    sector: 'Medellín',
    descripcion: 'Centro del SENA que forma talentos en actividad física, recreación, deporte y cultura.',
    categoria: 'educativos',
    isSena: true,
    tokens: ['sena', 'actividad fisica', 'deporte', 'cultura'],
    pills: ['Aprender', 'Crear', 'Crecer'],
    img: INSTITUCIONES_BECI.imgPlaceholder,
    alt: 'Centro de Formación en Actividad Física y Cultura SENA'
  },
  {
    id: 'complejo-sur',
    nombre: 'Complejo Sur (SENA)',
    sector: 'Itagüí, Autopista Sur',
    descripcion: 'Campus del SENA en el sur del Valle de Aburrá, con programas técnicos y tecnológicos para la región.',
    categoria: 'educativos',
    isSena: true,
    tokens: ['sena', 'complejo sur', 'itagui'],
    pills: ['Aprender', 'Crear', 'Crecer'],
    img: INSTITUCIONES_BECI.imgPlaceholder,
    alt: 'Complejo Sur SENA'
  },

  /* ---------- Lugares no SENA ---------- */
  {
    id: 'marco-fidel',
    nombre: 'I.E Marco Fidel',
    sector: 'Poblado, Medellín',
    descripcion: 'Institución educativa oficial en el barrio Poblado de Medellín.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['marco fidel', 'colegio', 'escuela', 'ie', 'institucion educativa'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLand2FjeXIyYdS_mngS3qC_kTvQQALkL-SSVQvwA4NhzoB8V2SDS_-TQbT4uCfAC8P0reiIWzd23CZtGM52Ch30Y94uJ4Pz2aGGg0-Wta9Z10wgzQhKMZYeREximRipkSJtU3pmWMeGNIdJ0U9ZOdl3NYhOWYAncGV7Mn9iH0KovxhyLyu0O-lLIVfEcsPWPcDggTu9xX3aPQHajzoPWJT9VO6AcDtGaVxxO0D0a_ddw-Wsa-TyOUmw',
    alt: 'I.E Marco Fidel',
    destacado: true
  },
  {
    id: 'san-buenaventura',
    nombre: 'Universidad de San Buenaventura',
    sector: 'Poblado, Medellín',
    descripcion: 'Universidad privada en el barrio Poblado de Medellín, oferta académica de pregrado y posgrado.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['universidad', 'san buenaventura', 'poblado'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqOxnLnBCMygnDRkZQY92j39sG68ryddg5PtSyIJx0aLSxakU_m7UQ3Eh641-5RDKRSCggmNWu3h1cLTWiH2BxHVoZK76-zAfbkKpYFDEQxmZLKGpL-AzXyK32IMOST9jZmMNh72jm5G4gQA2ZbZhF8LC8N4dhFVXBgzWj3EBuaCQixbJ7ayWv7MyQWFYw0hbllX4UCDagV7LJIozOnEaejt4Ba-3SNRZJHdTkx9Zm8hOPJEgSdivOxA',
    alt: 'Universidad de San Buenaventura',
    destacado: true
  },
  {
    id: 'udea',
    nombre: 'Universidad de Antioquia',
    sector: 'Medellín',
    descripcion: 'Universidad pública con campus urbano en Medellín y amplia oferta académica.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['universidad', 'udea', 'antioquia'],
    pills: ['Aprender', 'Crear', 'Crecer']
  },
  {
    id: 'unal-medellin',
    nombre: 'Universidad Nacional de Colombia, sede Medellín',
    sector: 'Medellín, La América',
    descripcion: 'Sede de la Universidad Nacional en Medellín con programas de pregrado y posgrado.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['universidad', 'nacional', 'unal'],
    pills: ['Aprender', 'Crear', 'Crecer']
  },
  {
    id: 'piloto',
    nombre: 'Biblioteca Pública Piloto',
    sector: 'Medellín, centro',
    descripcion: 'Una de las bibliotecas públicas más representativas de Medellín, con colecciones y programas culturales.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['biblioteca', 'lectura', 'cultura', 'piloto'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAco0QYjQptDRJYSPBGf6MY2X9DHXUzxj9pznImZzNHX4QVApcmCfuIn9A4z4Mg1CQ8mjtZvMNTSwO0zxadbimkOrs-349gdbP9kfzv9OnVZF1bHA2QH_JEmoxdZ6hC-xobYDjFu2OQXu0eqf7mGqjyhFn-9IKuoEdLRg51KqCrxl_7CTT6DbBax8AE52n7D2_BoJ9qoQtNV05v2eCf5jOKOrBupQrzd3J8HQkxEzcZh4MyF1CTCXCpRYzG17ldFsWFq_oO7bd8Ks68UWk',
    alt: 'Biblioteca Pública Piloto'
  },
  {
    id: 'explora',
    nombre: 'Parque Explora',
    sector: 'Medellín, centro oriental',
    descripcion: 'Museo interactivo de ciencia y tecnología en Medellín, ideal para aprender en familia.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['parque explora', 'ciencia', 'tecnologia', 'museo'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0aBf4muQaMTTbVzn8J71vf7etDLm9WbpGeDisp8RafosEFxYA6SSneOy63UftIoXzJhTbDdqcw3RWyGGZR7Ii02M7PqExtLV8JuR33eelLMih4CPLHQ2lnSBvdkqmKExKPBr6ywHCtzomsiKQ6VnxSvh491lTg8JoCxlX7utXwz2E7DxPlVSYiduMJIlN9FTPp7CLMI6j3NWZgKo9U-4kwIB1fzrmqXKeU9gMvJFliLizU7jSJfUqIKqmgv3tHaWG6tKkHvmqVw54tiM',
    alt: 'Parque Explora'
  },
  {
    id: 'museo-antioquia',
    nombre: 'Museo de Antioquia',
    sector: 'Medellín, centro',
    descripcion: 'Museo en el centro de Medellín con arte colombiano y obras del maestro Fernando Botero.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['museo', 'antioquia', 'arte', 'botero', 'cultura']
  },
  {
    id: 'jardin-botanico',
    nombre: 'Jardín Botánico de Medellín',
    sector: 'Medellín, Aranjuez',
    descripcion: 'Espacio verde en Medellín para recorrer, aprender sobre biodiversidad y disfrutar la naturaleza.',
    categoria: 'recreativos',
    isSena: false,
    tokens: ['jardin botanico', 'naturaleza', 'parque', 'verde'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0aBf4muQaMTTbVzn8J71vf7etDLm9WbpGeDisp8RafosEFxYA6SSneOy63UftIoXzJhTbDdqcw3RWyGGZR7Ii02M7PqExtLV8JuR33eelLMih4CPLHQ2lnSBvdkqmKExKPBr6ywHCtzomsiKQ6VnxSvh491lTg8JoCxlX7utXwz2E7DxPlVSYiduMJIlN9FTPp7CLMI6j3NWZgKo9U-4kwIB1fzrmqXKeU9gMvJFliLizU7jSJfUqIKqmgv3tHaWG6tKkHvmqVw54tiM',
    alt: 'Jardín Botánico'
  },
  {
    id: 'parque-norte',
    nombre: 'Parque Norte',
    sector: 'Medellín, Aranjuez',
    descripcion: 'Parque de diversiones y espacios verdes en el norte de Medellín.',
    categoria: 'recreativos',
    isSena: false,
    tokens: ['parque norte', 'parque', 'juegos', 'atracciones']
  },
  {
    id: 'atanasio-girardot',
    nombre: 'Estadio Atanasio Girardot',
    sector: 'Medellín, Estadio',
    descripcion: 'Estadio de fútbol y escenario de eventos deportivos en Medellín.',
    categoria: 'deportivos',
    isSena: false,
    tokens: ['estadio', 'atanasio', 'futbol', 'deporte']
  },
  {
    id: 'unidad-deportiva',
    nombre: 'Unidad Deportiva Atanasio Girardot',
    sector: 'Medellín, Estadio',
    descripcion: 'Complejo deportivo con canchas, piscinas y espacios para la práctica deportiva.',
    categoria: 'deportivos',
    isSena: false,
    tokens: ['unidad deportiva', 'deporte', 'canchas', 'gimnasio', 'piscina']
  },
  {
    id: 'confama',
    nombre: 'Confama',
    sector: 'Medellín',
    descripcion: 'Caja de compensación familiar con servicios de bienestar, educación y recreación.',
    categoria: 'institucionales',
    isSena: false,
    tokens: ['confama', 'caja de compensacion', 'bienestar'],
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALMKXXquT4ouMttr-3QmELjcrFjiPxAA2DQvB5d562EEoEzDuULeOj1JUO3kTbL_a7x3PVHqgHbyzVEjJFc5tDtgzIC-GxW30sUOO21rc6zoRSb2b5L9QifjRZ61R_hbmkfhYphF3KMvV2V3juISL2AmQZcbDRR2jYmigOXzlT4hNvdS0IKS3Hfq3oUCCqoZQbb5CjlOH0r1t-SfUKKrJVUYNqbweaEheUcQeeJPij-_VmNztC1QSY8HpOo40HCjK8c9koOVaxV6brQqE',
    alt: 'Confama'
  }
];