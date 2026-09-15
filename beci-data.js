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
  },

  /* ---------- Educativos (adicionales) ---------- */
  {
    id: 'eafit',
    nombre: 'Universidad EAFIT',
    sector: 'Medellín, El Poblado',
    descripcion: 'Universidad privada en El Poblado con amplia oferta académica en ingeniería, administración, economía y humanidades.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['universidad', 'eafit', 'poblado', 'ingenieria'],
    img: 'img/lugares/educativos.svg',
    alt: 'Universidad EAFIT'
  },
  {
    id: 'upb',
    nombre: 'Universidad Pontificia Bolivariana',
    sector: 'Medellín, Robledo',
    descripcion: 'Universidad privada en Robledo con campus histórico y oferta en ingeniería, diseño, salud y ciencias sociales.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['universidad', 'upb', 'pontificia', 'robledo'],
    img: 'img/lugares/educativos-2.svg',
    alt: 'Universidad Pontificia Bolivariana'
  },
  {
    id: 'itm',
    nombre: 'Instituto Tecnológico Metropolitano (ITM)',
    sector: 'Medellín, La América',
    descripcion: 'Institución universitaria pública enfocada en ingeniería y tecnología, con varios campus en Medellín.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['universidad', 'itm', 'tecnologico', 'tecnologia', 'ingenieria'],
    img: 'img/lugares/educativos.svg',
    alt: 'Instituto Tecnológico Metropolitano'
  },
  {
    id: 'pascual-bravo',
    nombre: 'Institución Universitaria Pascual Bravo',
    sector: 'Medellín, Boston (centro-oriental)',
    descripcion: 'Institución pública de educación superior con programas técnicos, tecnológicos y universitarios.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['universidad', 'pascual bravo', 'boston', 'educacion superior'],
    img: 'img/lugares/educativos-2.svg',
    alt: 'Institución Universitaria Pascual Bravo'
  },

  /* ---------- Deportivos (adicionales) ---------- */
  {
    id: 'coliseo-ivan-de-bedout',
    nombre: 'Coliseo Iván de Bedout',
    sector: 'Medellín, Unidad Deportiva Atanasio Girardot',
    descripcion: 'Escenario deportivo cubierto para baloncesto y fútbol sala, con capacidad para 6.000 espectadores.',
    categoria: 'deportivos',
    isSena: false,
    tokens: ['coliseo', 'ivan de bedout', 'baloncesto', 'futsal', 'deporte'],
    img: 'img/lugares/deportivos.svg',
    alt: 'Coliseo Iván de Bedout'
  },
  {
    id: 'velodromo-cochise',
    nombre: 'Velódromo Martín Emilio Cochise Rodríguez',
    sector: 'Medellín, Unidad Deportiva Atanasio Girardot',
    descripcion: 'Escenario para ciclismo de pista con pista de 250 metros, referente del deporte en Antioquia.',
    categoria: 'deportivos',
    isSena: false,
    tokens: ['velodromo', 'cochise', 'ciclismo', 'pista', 'deporte'],
    img: 'img/lugares/deportivos-2.svg',
    alt: 'Velódromo Cochise'
  },
  {
    id: 'complejo-acuatico',
    nombre: 'Complejo Acuático de Medellín',
    sector: 'Medellín, Unidad Deportiva Atanasio Girardot',
    descripcion: 'Escenario con piscinas olímpicas y áreas para natación, clavados y deportes acuáticos.',
    categoria: 'deportivos',
    isSena: false,
    tokens: ['complejo acuatico', 'piscina', 'natacion', 'clavados', 'deporte'],
    img: 'img/lugares/deportivos.svg',
    alt: 'Complejo Acuático de Medellín'
  },
  {
    id: 'uva-la-esperanza',
    nombre: 'UVA La Esperanza',
    sector: 'Medellín, comuna 1 - Popular',
    descripcion: 'Unidad de Vida Articulada con canchas, zonas verdes y espacios para deporte, cultura y encuentro comunitario.',
    categoria: 'deportivos',
    isSena: false,
    tokens: ['uva', 'la esperanza', 'popular', 'deporte', 'recreacion'],
    img: 'img/lugares/deportivos-2.svg',
    alt: 'UVA La Esperanza'
  },
  {
    id: 'uva-los-suenos',
    nombre: 'UVA de los Sueños',
    sector: 'Medellín, Versalles (comuna 3 - Manrique)',
    descripcion: 'Unidad de Vida Articulada con terrazas, canchas y salones para actividades deportivas y culturales.',
    categoria: 'deportivos',
    isSena: false,
    tokens: ['uva', 'los sue\u00f1os', 'manrique', 'versalles', 'deporte'],
    img: 'img/lugares/deportivos.svg',
    alt: 'UVA de los Sueños'
  },
  {
    id: 'uva-la-armonia',
    nombre: 'UVA de la Armonía',
    sector: 'Medellín, Santa Inés (comuna 3 - Manrique)',
    descripcion: 'Unidad de Vida Articulada con piscina, canchas y espacios para el deporte y el sano convivir.',
    categoria: 'deportivos',
    isSena: false,
    tokens: ['uva', 'la armonia', 'manrique', 'santa ines', 'piscina'],
    img: 'img/lugares/deportivos-2.svg',
    alt: 'UVA de la Armonía'
  },
  {
    id: 'uva-la-imaginacion',
    nombre: 'UVA de la Imaginación',
    sector: 'Medellín, Villa Hermosa',
    descripcion: 'Unidad de Vida Articulada con polideportivo, ludoteca y espacios para deporte, cultura y formación.',
    categoria: 'deportivos',
    isSena: false,
    tokens: ['uva', 'la imaginacion', 'villa hermosa', 'deporte'],
    img: 'img/lugares/deportivos.svg',
    alt: 'UVA de la Imaginación'
  },
  {
    id: 'uva-ilusion-verde',
    nombre: 'UVA Ilusión Verde',
    sector: 'Medellín, Los Naranjos (El Poblado)',
    descripcion: 'Unidad de Vida Articulada con zonas verdes, canchas y espacios para la recreación y el deporte.',
    categoria: 'deportivos',
    isSena: false,
    tokens: ['uva', 'ilusion verde', 'los naranjos', 'poblado', 'deporte'],
    img: 'img/lugares/deportivos-2.svg',
    alt: 'UVA Ilusión Verde'
  },
  {
    id: 'uva-san-javier',
    nombre: 'UVA San Javier',
    sector: 'Medellín, San Javier',
    descripcion: 'Unidad de Vida Articulada con canchas y espacios comunitarios para el deporte y la recreación.',
    categoria: 'deportivos',
    isSena: false,
    tokens: ['uva', 'san javier', 'deporte'],
    img: 'img/lugares/deportivos.svg',
    alt: 'UVA San Javier'
  },
  {
    id: 'uva-castilla',
    nombre: 'UVA Castilla',
    sector: 'Medellín, Castilla',
    descripcion: 'Unidad de Vida Articulada con polideportivo, zonas verdes y salones para actividades deportivas y culturales.',
    categoria: 'deportivos',
    isSena: false,
    tokens: ['uva', 'castilla', 'deporte'],
    img: 'img/lugares/deportivos-2.svg',
    alt: 'UVA Castilla'
  },
  {
    id: 'uva-robledo',
    nombre: 'UVA Robledo',
    sector: 'Medellín, Robledo',
    descripcion: 'Unidad de Vida Articulada con canchas, terrazas y espacios para el deporte y el encuentro del barrio.',
    categoria: 'deportivos',
    isSena: false,
    tokens: ['uva', 'robledo', 'deporte'],
    img: 'img/lugares/deportivos.svg',
    alt: 'UVA Robledo'
  },
  {
    id: 'uva-sol-de-oriente',
    nombre: 'UVA Sol de Oriente',
    sector: 'Medellín, Santo Domingo Savio (Villa Hermosa)',
    descripcion: 'Unidad de Vida Articulada con canchas y espacios comunitarios para deporte y recreación en el nororiente.',
    categoria: 'deportivos',
    isSena: false,
    tokens: ['uva', 'sol de oriente', 'santo domingo', 'villa hermosa', 'deporte'],
    img: 'img/lugares/deportivos-2.svg',
    alt: 'UVA Sol de Oriente'
  },
  {
    id: 'uva-de-la-cordialidad',
    nombre: 'UVA de la Cordialidad',
    sector: 'Medellín, Santo Domingo Savio 1',
    descripcion: 'Unidad de Vida Articulada con canchas y espacios para el deporte y el encuentro familiar.',
    categoria: 'deportivos',
    isSena: false,
    tokens: ['uva', 'cordialidad', 'santo domingo savio', 'deporte'],
    img: 'img/lugares/deportivos.svg',
    alt: 'UVA de la Cordialidad'
  },

  /* ---------- Cultura (adicionales) ---------- */
  {
    id: 'mamm',
    nombre: 'Museo de Arte Moderno de Medellín (MAMM)',
    sector: 'Medellín, Ciudad del Río',
    descripcion: 'Museo de arte moderno y contemporáneo en Ciudad del Río, con exposiciones, cine y talleres.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['museo', 'arte moderno', 'mamm', 'ciudad del rio', 'cultura'],
    img: 'img/lugares/cultura.svg',
    alt: 'Museo de Arte Moderno de Medellín'
  },
  {
    id: 'museo-casa-de-la-memoria',
    nombre: 'Museo Casa de la Memoria',
    sector: 'Medellín, La Candelaria (centro)',
    descripcion: 'Museo dedicado a la memoria histórica del conflicto y a la construcción de una cultura de paz.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['museo', 'casa de la memoria', 'memoria', 'cultura', 'paz'],
    img: 'img/lugares/cultura-2.svg',
    alt: 'Museo Casa de la Memoria'
  },
  {
    id: 'museo-el-castillo',
    nombre: 'Museo El Castillo',
    sector: 'Medellín, El Poblado',
    descripcion: 'Casa museo de estilo gótico con colecciones de arte europeo y jardines abiertos al público.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['museo', 'el castillo', 'poblado', 'arte', 'cultura'],
    img: 'img/lugares/cultura.svg',
    alt: 'Museo El Castillo'
  },
  {
    id: 'museo-casa-gardeliana',
    nombre: 'Casa Museo Gardeliana',
    sector: 'Medellín, centro',
    descripcion: 'Espacio dedicado a la vida y obra de Carlos Gardel, con objetos personales y colecciones del tango.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['museo', 'gardel', 'tango', 'casa gardeliana', 'cultura'],
    img: 'img/lugares/cultura-2.svg',
    alt: 'Casa Museo Gardeliana'
  },
  {
    id: 'museo-casa-pedro-nel-gomez',
    nombre: 'Casa Museo Pedro Nel Gómez',
    sector: 'Medellín, Aranjuez',
    descripcion: 'Casa del muralista Pedro Nel Gómez con murales al fresco, acuarelas y óleos de su obra.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['museo', 'pedro nel gomez', 'murales', 'arte', 'cultura'],
    img: 'img/lugares/cultura.svg',
    alt: 'Casa Museo Pedro Nel Gómez'
  },
  {
    id: 'teatro-metropolitano',
    nombre: 'Teatro Metropolitano José Gutiérrez Gómez',
    sector: 'Medellín, centro',
    descripcion: 'Escenario cultural con programación de música, ópera, danza y teatro en el centro de la ciudad.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['teatro', 'metropolitano', 'opera', 'musica', 'cultura'],
    img: 'img/lugares/cultura-2.svg',
    alt: 'Teatro Metropolitano'
  },
  {
    id: 'teatro-pablo-tobon',
    nombre: 'Teatro Pablo Tobón Uribe',
    sector: 'Medellín, centro',
    descripcion: 'Teatro tradicional con temporadas de teatro, música y espectáculos para toda la familia.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['teatro', 'pablo tobon', 'cultura', 'espectaculos'],
    img: 'img/lugares/cultura.svg',
    alt: 'Teatro Pablo Tobón Uribe'
  },
  {
    id: 'teatro-camilo-torres',
    nombre: 'Teatro Camilo Torres',
    sector: 'Medellín, centro',
    descripcion: 'Sala teatral universitaria de la Universidad de Antioquia con programación cultural abierta.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['teatro', 'camilo torres', 'udea', 'cultura'],
    img: 'img/lugares/cultura-2.svg',
    alt: 'Teatro Camilo Torres'
  },
  {
    id: 'biblioteca-espana',
    nombre: 'Parque Biblioteca España',
    sector: 'Medellín, Santo Domingo Savio',
    descripcion: 'Biblioteca pública con mirador panorámico, salas de lectura y programación cultural en Santo Domingo.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['biblioteca', 'espana', 'santo domingo', 'lectura', 'cultura'],
    img: 'img/lugares/cultura.svg',
    alt: 'Parque Biblioteca España'
  },
  {
    id: 'biblioteca-belen',
    nombre: 'Parque Biblioteca Belén',
    sector: 'Medellín, Belén',
    descripcion: 'Biblioteca pública con sala infantil, auditorio y programas culturales para el barrio Belén.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['biblioteca', 'belen', 'lectura', 'cultura'],
    img: 'img/lugares/cultura-2.svg',
    alt: 'Parque Biblioteca Belén'
  },
  {
    id: 'biblioteca-san-javier',
    nombre: 'Parque Biblioteca San Javier',
    sector: 'Medellín, San Javier',
    descripcion: 'Biblioteca pública con salas de lectura, laboratorios creativos y encuentros comunitarios.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['biblioteca', 'san javier', 'lectura', 'cultura'],
    img: 'img/lugares/cultura.svg',
    alt: 'Parque Biblioteca San Javier'
  },
  {
    id: 'planetario',
    nombre: 'Planetario de Medellín',
    sector: 'Medellín, Parque de los Deseos (Aranjuez)',
    descripcion: 'Centro de astronomía con cúpula de proyección, exposiciones de ciencia y cine en el Parque de los Deseos.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['planetario', 'astronomia', 'ciencia', 'estrellas', 'cultura'],
    img: 'img/lugares/cultura-2.svg',
    alt: 'Planetario de Medellín'
  },

  /* ---------- Recreativos (adicionales) ---------- */
  {
    id: 'parque-arvi',
    nombre: 'Parque Arví',
    sector: 'Medellín, Santa Elena',
    descripcion: 'Parque ecológico y arqueológico en Santa Elena, ideal para senderismo, picnic y turismo de naturaleza.',
    categoria: 'recreativos',
    isSena: false,
    tokens: ['arvi', 'santa elena', 'senderismo', 'naturaleza', 'parque'],
    img: 'img/lugares/recreativos.svg',
    alt: 'Parque Arví'
  },
  {
    id: 'cerro-nutibara',
    nombre: 'Cerro Nutibara y Pueblito Paisa',
    sector: 'Medellín, El Poblado (acceso por la avenida)',
    descripcion: 'Cerro urbano con el Pueblito Paisa, mirador de la ciudad y parque de las esculturas.',
    categoria: 'recreativos',
    isSena: false,
    tokens: ['cerro nutibara', 'pueblito paisa', 'mirador', 'parque'],
    img: 'img/lugares/recreativos-2.svg',
    alt: 'Cerro Nutibara y Pueblito Paisa'
  },
  {
    id: 'cerro-el-volador',
    nombre: 'Cerro El Volador',
    sector: 'Medellín, Robledo',
    descripcion: 'Cerro urbano con senderos, canchas y áreas verdes, el más grande de la ciudad.',
    categoria: 'recreativos',
    isSena: false,
    tokens: ['cerro el volador', 'robledo', 'senderismo', 'naturaleza'],
    img: 'img/lugares/recreativos.svg',
    alt: 'Cerro El Volador'
  },
  {
    id: 'parque-pies-descalzos',
    nombre: 'Parque de los Pies Descalzos',
    sector: 'Medellín, centro',
    descripcion: 'Parque interactivo con zonas de arena, agua y espejos de agua en pleno centro de la ciudad.',
    categoria: 'recreativos',
    isSena: false,
    tokens: ['pies descalzos', 'parque', 'centro', 'arena'],
    img: 'img/lugares/recreativos-2.svg',
    alt: 'Parque de los Pies Descalzos'
  },
  {
    id: 'parque-de-los-deseos',
    nombre: 'Parque de los Deseos',
    sector: 'Medellín, Aranjuez (calle 71)',
    descripcion: 'Parque cultural junto a la Universidad de Antioquia con cine al aire libre, exposiciones y eventos.',
    categoria: 'recreativos',
    isSena: false,
    tokens: ['parque de los deseos', 'aranjuez', 'cine', 'parque'],
    img: 'img/lugares/recreativos.svg',
    alt: 'Parque de los Deseos'
  },
  {
    id: 'parque-lleras',
    nombre: 'Parque Lleras',
    sector: 'Medellín, El Poblado',
    descripcion: 'Zona gastronómica y de rumba en El Poblado, con restaurantes, bares y ambiente nocturno.',
    categoria: 'recreativos',
    isSena: false,
    tokens: ['parque lleras', 'poblado', 'rumba', 'restaurantes'],
    img: 'img/lugares/recreativos-2.svg',
    alt: 'Parque Lleras'
  },
  {
    id: 'parque-la-presidenta',
    nombre: 'Parque La Presidenta',
    sector: 'Medellín, El Poblado',
    descripcion: 'Parque lineal a orillas del río Medellín, ideal para caminar, trotar y compartir en familia.',
    categoria: 'recreativos',
    isSena: false,
    tokens: ['la presidenta', 'parque', 'poblado', 'rio'],
    img: 'img/lugares/recreativos.svg',
    alt: 'Parque La Presidenta'
  },
  {
    id: 'parque-juanes-de-la-paz',
    nombre: 'Parque Juanes de la Paz',
    sector: 'Medellín, San Javier',
    descripcion: 'Parque construido como homenaje a la música y la paz, con zona de comidas y mirador.',
    categoria: 'recreativos',
    isSena: false,
    tokens: ['juanes', 'san javier', 'parque', 'musica'],
    img: 'img/lugares/recreativos-2.svg',
    alt: 'Parque Juanes de la Paz'
  },
  {
    id: 'parque-bolivar',
    nombre: 'Parque Bolívar',
    sector: 'Medellín, centro',
    descripcion: 'Parque tradicional del centro con la estatua de Bolívar y los puestos del Mercadillo de San Alejo.',
    categoria: 'recreativos',
    isSena: false,
    tokens: ['parque bolivar', 'centro', 'parque'],
    img: 'img/lugares/recreativos.svg',
    alt: 'Parque Bolívar'
  },
  {
    id: 'parque-berrio',
    nombre: 'Parque Berrío',
    sector: 'Medellín, centro',
    descripcion: 'Plaza central de la ciudad, punto de encuentro histórico junto a la Catedral Metropolitana.',
    categoria: 'recreativos',
    isSena: false,
    tokens: ['parque berrio', 'centro', 'catedral', 'plaza'],
    img: 'img/lugares/recreativos-2.svg',
    alt: 'Parque Berrío'
  },
  {
    id: 'parque-san-antonio',
    nombre: 'Parque San Antonio',
    sector: 'Medellín, centro',
    descripcion: 'Plaza con zonas verdes y obras de arte urbano, escenario de ferias y eventos culturales.',
    categoria: 'recreativos',
    isSena: false,
    tokens: ['parque san antonio', 'centro', 'plaza', 'eventos'],
    img: 'img/lugares/recreativos.svg',
    alt: 'Parque San Antonio'
  },
  {
    id: 'parque-las-luces',
    nombre: 'Plaza de las Luces (Parque de las Luces)',
    sector: 'Medellín, centro',
    descripcion: 'Plaza con 300 columnas de luz que se convierte en punto de encuentro y escenario cultural.',
    categoria: 'recreativos',
    isSena: false,
    tokens: ['las luces', 'plaza de las luces', 'centro', 'parque'],
    img: 'img/lugares/recreativos-2.svg',
    alt: 'Plaza de las Luces'
  },
  {
    id: 'parque-ciudad-del-rio',
    nombre: 'Parque Ciudad del Río',
    sector: 'Medellín, Ciudad del Río (Guayabal)',
    descripcion: 'Parque lineal en la antigua zona industrial, con senderos, skatepark y zonas verdes.',
    categoria: 'recreativos',
    isSena: false,
    tokens: ['ciudad del rio', 'parque', 'guayabal', 'skate'],
    img: 'img/lugares/recreativos.svg',
    alt: 'Parque Ciudad del Río'
  },

  /* ---------- Institucionales (adicionales) ---------- */
  {
    id: 'alcaldia-medellin',
    nombre: 'Alcaldía de Medellín',
    sector: 'Medellín, La Alpujarra (centro)',
    descripcion: 'Casa de Gobierno de la ciudad con atención a la ciudadanía y oficinas de los servicios públicos municipales.',
    categoria: 'institucionales',
    isSena: false,
    tokens: ['alcaldia', 'medellin', 'alpujarra', 'gobierno', 'tramites'],
    img: 'img/lugares/institucionales.svg',
    alt: 'Alcaldía de Medellín'
  },
  {
    id: 'concejo-de-medellin',
    nombre: 'Concejo de Medellín',
    sector: 'Medellín, Centro Administrativo La Alpujarra',
    descripcion: 'Corporación pública que representa a la ciudadanía y debate las decisiones de la administración municipal.',
    categoria: 'institucionales',
    isSena: false,
    tokens: ['concejo', 'medellin', 'alpujarra', 'corporacionpublica'],
    img: 'img/lugares/institucionales-2.svg',
    alt: 'Concejo de Medellín'
  },
  {
    id: 'camara-de-comercio',
    nombre: 'Cámara de Comercio de Medellín para Antioquia',
    sector: 'Medellín, centro',
    descripcion: 'Entidad que apoya a los empresarios con registro mercantil, formación y servicios para emprender.',
    categoria: 'institucionales',
    isSena: false,
    tokens: ['camara de comercio', 'empresarios', 'registro mercantil', 'emprender'],
    img: 'img/lugares/institucionales.svg',
    alt: 'Cámara de Comercio de Medellín'
  },
  {
    id: 'epm',
    nombre: 'EPM (Empresas Públicas de Medellín)',
    sector: 'Medellín, centro',
    descripcion: 'Empresa de servicios públicos de acueducto, energía y gas, con sede emblemática en el centro de la ciudad.',
    categoria: 'institucionales',
    isSena: false,
    tokens: ['epm', 'empresas publicas', 'servicios publicos', 'energia'],
    img: 'img/lugares/institucionales-2.svg',
    alt: 'EPM'
  },
  {
    id: 'comfenalco',
    nombre: 'Comfenalco Antioquia',
    sector: 'Medellín, centro',
    descripcion: 'Caja de compensación familiar con servicios de salud, educación, recreación y bienestar social.',
    categoria: 'institucionales',
    isSena: false,
    tokens: ['comfenalco', 'caja de compensacion', 'bienestar'],
    img: 'img/lugares/institucionales.svg',
    alt: 'Comfenalco Antioquia'
  },
  {
    id: 'colsubsidio',
    nombre: 'Colsubsidio',
    sector: 'Medellín, centro',
    descripcion: 'Caja de compensación familiar con programas de salud, vivienda, educación y recreación.',
    categoria: 'institucionales',
    isSena: false,
    tokens: ['colsubsidio', 'caja de compensacion', 'bienestar'],
    img: 'img/lugares/institucionales-2.svg',
    alt: 'Colsubsidio'
  },
  {
    id: 'metro-medellin',
    nombre: 'Metro de Medellín',
    sector: 'Medellín, estación San Antonio (centro)',
    descripcion: 'Sistema de transporte masivo de la ciudad con líneas de metro, Metrocable y tranvía.',
    categoria: 'institucionales',
    isSena: false,
    tokens: ['metro', 'transporte', 'metrocable', 'tranvia', 'movilidad'],
    img: 'img/lugares/institucionales-2.svg',
    alt: 'Metro de Medellín'
  },
  {
    id: 'registraduria',
    nombre: 'Registraduría Nacional del Estado Civil',
    sector: 'Medellín, centro',
    descripcion: 'Oficina responsable de la identificación ciudadana: cédulas, pasaportes y registro civil.',
    categoria: 'institucionales',
    isSena: false,
    tokens: ['registraduria', 'cedula', 'pasaporte', 'identificacion', 'tramites'],
    img: 'img/lugares/institucionales.svg',
    alt: 'Registraduría Nacional'
  },
  {
    id: 'personeria',
    nombre: 'Personería de Medellín',
    sector: 'Medellín, centro',
    descripcion: 'Entidad que protege los derechos humanos y atiende quejas y reclamos de la ciudadanía.',
    categoria: 'institucionales',
    isSena: false,
    tokens: ['personeria', 'derechos', 'quejas', 'medellin'],
    img: 'img/lugares/institucionales-2.svg',
    alt: 'Personería de Medellín'
  },
  {
    id: 'policia-metropolitana',
    nombre: 'Policía Metropolitana del Valle de Aburrá',
    sector: 'Medellín, centro',
    descripcion: 'Institución encargada de la seguridad ciudadana y la convivencia en el área metropolitana.',
    categoria: 'institucionales',
    isSena: false,
    tokens: ['policia', 'seguridad', 'metropolitana', 'convivencia'],
    img: 'img/lugares/institucionales.svg',
    alt: 'Policía Metropolitana'
  },
  {
    id: 'terminal-norte',
    nombre: 'Terminal de Transporte del Norte',
    sector: 'Medellín, Aranjuez',
    descripcion: 'Terminal de buses con rutas hacia el norte de Antioquia, la costa Caribe y municipios cercanos.',
    categoria: 'institucionales',
    isSena: false,
    tokens: ['terminal norte', 'buses', 'transporte', 'terminal'],
    img: 'img/lugares/institucionales-2.svg',
    alt: 'Terminal del Norte'
  },
  {
    id: 'terminal-sur',
    nombre: 'Terminal de Transporte del Sur',
    sector: 'Medellín, Guayabal',
    descripcion: 'Terminal de buses con rutas hacia el sur del Valle de Aburrá, el oriente y el resto del país.',
    categoria: 'institucionales',
    isSena: false,
    tokens: ['terminal sur', 'buses', 'transporte', 'terminal'],
    img: 'img/lugares/institucionales.svg',
    alt: 'Terminal del Sur'
  },
  {
    id: 'aeropuerto-olaya-herrera',
    nombre: 'Aeropuerto Olaya Herrera',
    sector: 'Medellín, Guayabal',
    descripcion: 'Aeropuerto de la ciudad con vuelos regionales y nacionales desde el corazón de Medellín.',
    categoria: 'institucionales',
    isSena: false,
    tokens: ['aeropuerto', 'olaya herrera', 'vuelos', 'avion'],
    img: 'img/lugares/institucionales-2.svg',
    alt: 'Aeropuerto Olaya Herrera'
  },

  /* ---------- Salud ---------- */
  {
    id: 'hospital-pablo-tobon-uribe',
    nombre: 'Hospital Pablo Tobón Uribe',
    sector: 'Medellín, Buenos Aires (centro-oriental)',
    descripcion: 'Hospital universitario de alta complejidad, reconocido por su excelencia en atención médica.',
    categoria: 'salud',
    isSena: false,
    tokens: ['hospital', 'pablo tobon', 'salud', 'clinica'],
    img: 'img/lugares/salud.svg',
    alt: 'Hospital Pablo Tobón Uribe'
  },
  {
    id: 'hospital-san-vicente',
    nombre: 'Hospital Universitario San Vicente Fundación',
    sector: 'Medellín, La Candelaria (centro)',
    descripcion: 'Hospital universitario de referencia con servicios de alta complejidad y formación médica.',
    categoria: 'salud',
    isSena: false,
    tokens: ['hospital', 'san vicente', 'salud', 'universitario'],
    img: 'img/lugares/salud-2.svg',
    alt: 'Hospital San Vicente Fundación'
  },
  {
    id: 'hospital-general-medellin',
    nombre: 'Hospital General de Medellín',
    sector: 'Medellín, centro',
    descripcion: 'Hospital público de la ciudad con servicios de urgencias, cirugía y especialidades.',
    categoria: 'salud',
    isSena: false,
    tokens: ['hospital general', 'salud', 'urgencias', 'medellin'],
    img: 'img/lugares/salud.svg',
    alt: 'Hospital General de Medellín'
  },
  {
    id: 'hospital-infantil-san-vicente',
    nombre: 'Hospital Infantil San Vicente Fundación',
    sector: 'Medellín, centro',
    descripcion: 'Centro de salud especializado en la atención pediátrica y el cuidado de los niños.',
    categoria: 'salud',
    isSena: false,
    tokens: ['hospital infantil', 'niños', 'pediatria', 'salud'],
    img: 'img/lugares/salud-2.svg',
    alt: 'Hospital Infantil San Vicente'
  },
  {
    id: 'clinica-las-americas',
    nombre: 'Clínica Las Américas',
    sector: 'Medellín, El Poblado',
    descripcion: 'Institución prestadora de salud con alta complejidad y amplia red de especialistas.',
    categoria: 'salud',
    isSena: false,
    tokens: ['clinica', 'las americas', 'salud', 'especialistas'],
    img: 'img/lugares/salud.svg',
    alt: 'Clínica Las Américas'
  },
  {
    id: 'clinica-el-rosario',
    nombre: 'Clínica El Rosario',
    sector: 'Medellín, centro',
    descripcion: 'Clínica con servicios de urgencias, hospitalización y consulta de especialistas en el centro.',
    categoria: 'salud',
    isSena: false,
    tokens: ['clinica', 'el rosario', 'salud', 'urgencias'],
    img: 'img/lugares/salud-2.svg',
    alt: 'Clínica El Rosario'
  },
  {
    id: 'clinica-medellin',
    nombre: 'Clínica Medellín',
    sector: 'Medellín, Aguacatala (El Poblado)',
    descripcion: 'Institución de salud con urgencias, hospitalización y especialidades a orillas de la avenida Vegas.',
    categoria: 'salud',
    isSena: false,
    tokens: ['clinica medellin', 'aguacatala', 'salud', 'hospitalizacion'],
    img: 'img/lugares/salud.svg',
    alt: 'Clínica Medellín'
  },
  {
    id: 'clinica-del-prado',
    nombre: 'Clínica del Prado',
    sector: 'Medellín, centro',
    descripcion: 'Institución de salud con servicios ambulatorios, urgencias y especialidades médicas.',
    categoria: 'salud',
    isSena: false,
    tokens: ['clinica del prado', 'salud', 'prado', 'urgencias'],
    img: 'img/lugares/salud-2.svg',
    alt: 'Clínica del Prado'
  },
  {
    id: 'clinica-soma',
    nombre: 'Clínica Soma',
    sector: 'Medellín, centro',
    descripcion: 'Centro médico con consulta de especialistas y servicios de diagnóstico en pleno centro.',
    categoria: 'salud',
    isSena: false,
    tokens: ['clinica soma', 'salud', 'diagnostico', 'especialistas'],
    img: 'img/lugares/salud.svg',
    alt: 'Clínica Soma'
  },
  {
    id: 'clinica-antioquia',
    nombre: 'Clínica Antioquia',
    sector: 'Medellín, centro',
    descripcion: 'Institución de salud tradicional con servicios de urgencias y hospitalización.',
    categoria: 'salud',
    isSena: false,
    tokens: ['clinica antioquia', 'salud', 'urgencias'],
    img: 'img/lugares/salud-2.svg',
    alt: 'Clínica Antioquia'
  },
  {
    id: 'clinica-universitaria-bolivariana',
    nombre: 'Clínica Universitaria Bolivariana',
    sector: 'Medellín, Robledo',
    descripcion: 'Institución de salud universitaria vinculada a la UPB, con urgencias y especialidades.',
    categoria: 'salud',
    isSena: false,
    tokens: ['clinica', 'bolivariana', 'upb', 'robledo', 'salud'],
    img: 'img/lugares/salud.svg',
    alt: 'Clínica Universitaria Bolivariana'
  },
  {
    id: 'ips-universitaria',
    nombre: 'IPS Universitaria',
    sector: 'Medellín, Ciudad Universitaria (La América)',
    descripcion: 'Institución prestadora de salud de la Universidad de Antioquia con servicios y especialidades.',
    categoria: 'salud',
    isSena: false,
    tokens: ['ips universitaria', 'udea', 'salud', 'antioquia'],
    img: 'img/lugares/salud-2.svg',
    alt: 'IPS Universitaria'
  },
  {
    id: 'metrosalud',
    nombre: 'Metrosalud',
    sector: 'Medellín, varias comunas (centro)',
    descripcion: 'Red pública de salud del municipio con unidades hospitalarias y centros de atención por toda la ciudad.',
    categoria: 'salud',
    isSena: false,
    tokens: ['metrosalud', 'salud', 'unidades', 'publica'],
    img: 'img/lugares/salud.svg',
    alt: 'Metrosalud'
  },
  {
    id: 'liga-contra-el-cancer',
    nombre: 'Liga Colombiana Contra el Cáncer (Antioquia)',
    sector: 'Medellín, centro',
    descripcion: 'Organización que acompaña a pacientes con cáncer con prevención, diagnóstico y apoyo.',
    categoria: 'salud',
    isSena: false,
    tokens: ['liga', 'cancer', 'oncologia', 'salud'],
    img: 'img/lugares/salud-2.svg',
    alt: 'Liga Contra el Cáncer'
  },
  {
    id: 'secretaria-salud',
    nombre: 'Secretaría de Salud de Medellín',
    sector: 'Medellín, La Alpujarra (centro)',
    descripcion: 'Dependencia municipal encargada de la salud pública, la atención y las campañas de bienestar.',
    categoria: 'salud',
    isSena: false,
    tokens: ['secretaria de salud', 'salud', 'programas', 'bienestar'],
    img: 'img/lugares/salud.svg',
    alt: 'Secretaría de Salud de Medellín'
  },

  /* ---------- Tecnología ---------- */
  {
    id: 'ruta-n',
    nombre: 'Ruta N',
    sector: 'Medellín, barrio Sevilla (norte)',
    descripcion: 'Centro de innovación y negocios de Medellín con espacios para empresas, laboratorios y emprendimiento tecnológico.',
    categoria: 'tecnologia',
    isSena: false,
    tokens: ['ruta n', 'innovacion', 'tecnologia', 'emprendimiento', 'startups'],
    img: 'img/lugares/tecnologia.svg',
    alt: 'Ruta N'
  },
  {
    id: 'centro-valle-del-software-robledo',
    nombre: 'Centro del Valle del Software - Robledo',
    sector: 'Medellín, López de Mesa (Robledo)',
    descripcion: 'Espacio de formación y coworking enfocado en desarrollo de software y tecnología para la comunidad.',
    categoria: 'tecnologia',
    isSena: false,
    tokens: ['valle del software', 'software', 'robledo', 'tecnologia', 'coworking'],
    img: 'img/lugares/tecnologia-2.svg',
    alt: 'Centro del Valle del Software'
  },
  {
    id: 'facultad-minas',
    nombre: 'Facultad de Minas - Universidad Nacional',
    sector: 'Medellín, Robledo (El Volador)',
    descripcion: 'Campus de ingeniería con laboratorios y programas de investigación en diversas disciplinas tecnológicas.',
    categoria: 'tecnologia',
    isSena: false,
    tokens: ['facultad de minas', 'universidad nacional', 'ingenieria', 'robledo', 'tecnologia'],
    img: 'img/lugares/tecnologia.svg',
    alt: 'Facultad de Minas'
  },
  {
    id: 'tecnoparque-sena',
    nombre: 'Tecnoparque SENA Medellín',
    sector: 'Medellín',
    descripcion: 'Red de innovación del SENA para el desarrollo de proyectos tecnológicos y de base científica.',
    categoria: 'tecnologia',
    isSena: false,
    tokens: ['tecnoparque', 'sena', 'innovacion', 'tecnologia', 'proyectos'],
    img: 'img/lugares/tecnologia-2.svg',
    alt: 'Tecnoparque SENA'
  },
  {
    id: 'cedezo-popular',
    nombre: 'Cedezo Popular',
    sector: 'Medellín, comuna 1 - Popular',
    descripcion: 'Centro de Desarrollo Empresarial Zonal con oferta de empleo, emprendimiento y formación tecnológica.',
    categoria: 'tecnologia',
    isSena: false,
    tokens: ['cedezo', 'popular', 'emprendimiento', 'empleo'],
    img: 'img/lugares/tecnologia.svg',
    alt: 'Cedezo Popular'
  },
  {
    id: 'cedezo-manrique',
    nombre: 'Cedezo Manrique',
    sector: 'Medellín, Manrique',
    descripcion: 'Centro de Desarrollo Empresarial Zonal con servicios para emprendedores y oferta de empleo.',
    categoria: 'tecnologia',
    isSena: false,
    tokens: ['cedezo', 'manrique', 'emprendimiento', 'empleo'],
    img: 'img/lugares/tecnologia-2.svg',
    alt: 'Cedezo Manrique'
  },
  {
    id: 'cedezo-aranjuez',
    nombre: 'Cedezo Aranjuez',
    sector: 'Medellín, Aranjuez',
    descripcion: 'Centro de Desarrollo Empresarial Zonal con apoyo a emprendedores y espacios de formación.',
    categoria: 'tecnologia',
    isSena: false,
    tokens: ['cedezo', 'aranjuez', 'emprendimiento', 'empleo'],
    img: 'img/lugares/tecnologia.svg',
    alt: 'Cedezo Aranjuez'
  },
  {
    id: 'cedezo-castilla',
    nombre: 'Cedezo Castilla',
    sector: 'Medellín, Castilla',
    descripcion: 'Centro de Desarrollo Empresarial Zonal con oferta de empleo, crédito y formación para emprender.',
    categoria: 'tecnologia',
    isSena: false,
    tokens: ['cedezo', 'castilla', 'emprendimiento', 'empleo'],
    img: 'img/lugares/tecnologia-2.svg',
    alt: 'Cedezo Castilla'
  },
  {
    id: 'cedezo-villa-hermosa',
    nombre: 'Cedezo Villa Hermosa',
    sector: 'Medellín, Villa Hermosa',
    descripcion: 'Centro de Desarrollo Empresarial Zonal con acompañamiento a emprendimientos y oferta institucional.',
    categoria: 'tecnologia',
    isSena: false,
    tokens: ['cedezo', 'villa hermosa', 'emprendimiento', 'empleo'],
    img: 'img/lugares/tecnologia.svg',
    alt: 'Cedezo Villa Hermosa'
  },
  {
    id: 'cedezo-centro',
    nombre: 'Cedezo Centro',
    sector: 'Medellín, La Candelaria (centro)',
    descripcion: 'Centro de Desarrollo Empresarial Zonal con servicios para quienes quieren emprender en el centro.',
    categoria: 'tecnologia',
    isSena: false,
    tokens: ['cedezo', 'centro', 'candelaria', 'emprendimiento'],
    img: 'img/lugares/tecnologia-2.svg',
    alt: 'Cedezo Centro'
  },
  {
    id: 'cedezo-san-javier',
    nombre: 'Cedezo San Javier',
    sector: 'Medellín, San Javier',
    descripcion: 'Centro de Desarrollo Empresarial Zonal con oferta de empleo, emprendimiento y formación.',
    categoria: 'tecnologia',
    isSena: false,
    tokens: ['cedezo', 'san javier', 'emprendimiento', 'empleo'],
    img: 'img/lugares/tecnologia.svg',
    alt: 'Cedezo San Javier'
  },
  {
    id: 'cedezo-belen',
    nombre: 'Cedezo Belén',
    sector: 'Medellín, Belén',
    descripcion: 'Centro de Desarrollo Empresarial Zonal con acompañamiento a emprendedores y oferta de empleo.',
    categoria: 'tecnologia',
    isSena: false,
    tokens: ['cedezo', 'belen', 'emprendimiento', 'empleo'],
    img: 'img/lugares/tecnologia-2.svg',
    alt: 'Cedezo Belén'
  },
  {
    id: 'cedezo-santa-cruz',
    nombre: 'Cedezo Santa Cruz',
    sector: 'Medellín, Santa Cruz',
    descripcion: 'Centro de Desarrollo Empresarial Zonal con servicios para emprendedores de la zona nororiental.',
    categoria: 'tecnologia',
    isSena: false,
    tokens: ['cedezo', 'santa cruz', 'emprendimiento', 'empleo'],
    img: 'img/lugares/tecnologia.svg',
    alt: 'Cedezo Santa Cruz'
  },
  {
    id: 'cedezo-san-cristobal',
    nombre: 'Cedezo San Cristóbal',
    sector: 'Medellín, corregimiento San Cristóbal',
    descripcion: 'Centro de Desarrollo Empresarial Zonal con oferta institucional para la zona rural-urbana.',
    categoria: 'tecnologia',
    isSena: false,
    tokens: ['cedezo', 'san cristobal', 'emprendimiento', 'empleo'],
    img: 'img/lugares/tecnologia-2.svg',
    alt: 'Cedezo San Cristóbal'
  },
  {
    id: 'cedezo-san-antonio-de-prado',
    nombre: 'Cedezo San Antonio de Prado',
    sector: 'Medellín, corregimiento San Antonio de Prado',
    descripcion: 'Centro de Desarrollo Empresarial Zonal con servicios para emprendedores del suroccidente.',
    categoria: 'tecnologia',
    isSena: false,
    tokens: ['cedezo', 'san antonio de prado', 'emprendimiento', 'empleo'],
    img: 'img/lugares/tecnologia.svg',
    alt: 'Cedezo San Antonio de Prado'
  },

  /* ---------- Arte ---------- */
  {
    id: 'galeria-alonso-garces',
    nombre: 'Galería Alonso Garcés',
    sector: 'Medellín, centro',
    descripcion: 'Galería de arte contemporáneo con una de las tradiciones más reconocidas de la ciudad.',
    categoria: 'arte',
    isSena: false,
    tokens: ['galeria', 'alonso garces', 'arte', 'exposiciones'],
    img: 'img/lugares/arte.svg',
    alt: 'Galería Alonso Garcés'
  },
  {
    id: 'galeria-la-oficina',
    nombre: 'Galería de Arte La Oficina',
    sector: 'Medellín, centro',
    descripcion: 'Galería de arte contemporáneo con programación de exposiciones de artistas nacionales e internacionales.',
    categoria: 'arte',
    isSena: false,
    tokens: ['galeria', 'la oficina', 'arte', 'exposiciones'],
    img: 'img/lugares/arte-2.svg',
    alt: 'Galería La Oficina'
  },
  {
    id: 'galeria-duque-arango',
    nombre: 'Galería Duque Arango',
    sector: 'Medellín, El Poblado',
    descripcion: 'Galería de arte contemporáneo en El Poblado con exposiciones de artistas modernos.',
    categoria: 'arte',
    isSena: false,
    tokens: ['galeria', 'duque arango', 'arte', 'poblado'],
    img: 'img/lugares/arte.svg',
    alt: 'Galería Duque Arango'
  },
  {
    id: 'espacio-el-dorado',
    nombre: 'Espacio El Dorado',
    sector: 'Medellín, centro',
    descripcion: 'Espacio de arte independiente del centro de Medellín, dedicado a la creación y la exhibición.',
    categoria: 'arte',
    isSena: false,
    tokens: ['espacio', 'el dorado', 'arte', 'exposiciones'],
    img: 'img/lugares/arte-2.svg',
    alt: 'Espacio El Dorado'
  },
  {
    id: 'casa-tres-patios',
    nombre: 'Casa Tres Patios',
    sector: 'Medellín, El Poblado',
    descripcion: 'Proyecto de arte contemporáneo y residencias para artistas en el sector de El Poblado.',
    categoria: 'arte',
    isSena: false,
    tokens: ['casa tres patios', 'arte', 'residencias', 'contemporaneo'],
    img: 'img/lugares/arte.svg',
    alt: 'Casa Tres Patios'
  },
  {
    id: 'parque-de-las-esculturas',
    nombre: 'Parque de las Esculturas (Cerro Nutibara)',
    sector: 'Medellín, Cerro Nutibara',
    descripcion: 'Colección de esculturas al aire libre en el Cerro Nutibara, con obras de maestros colombianos.',
    categoria: 'arte',
    isSena: false,
    tokens: ['esculturas', 'cerro nutibara', 'arte', 'parque'],
    img: 'img/lugares/arte-2.svg',
    alt: 'Parque de las Esculturas'
  },
  {
    id: 'comuna-13-graffiti',
    nombre: 'Comuna 13 con arte urbano',
    sector: 'Medellín, San Javier (Las Independencias)',
    descripcion: 'Recorridos de grafiti y arte urbano en las calles de la Comuna 13, símbolo de transformación.',
    categoria: 'arte',
    isSena: false,
    tokens: ['comuna 13', 'grafiti', 'arte urbano', 'san javier', 'escaleras'],
    img: 'img/lugares/arte.svg',
    alt: 'Comuna 13 arte urbano'
  },
  {
    id: 'mercadillo-san-alejo',
    nombre: 'Mercadillo de San Alejo',
    sector: 'Medellín, Parque Bolívar (centro)',
    descripcion: 'Feria artesanal del primer fin de semana de cada mes con arte del pueblo y oficios tradicionales.',
    categoria: 'arte',
    isSena: false,
    tokens: ['mercadillo', 'san alejo', 'artesanias', 'parque bolivar', 'arte'],
    img: 'img/lugares/arte-2.svg',
    alt: 'Mercadillo de San Alejo'
  },
  {
    id: 'museo-upb',
    nombre: 'Museo de la Universidad Pontificia Bolivariana',
    sector: 'Medellín, Robledo',
    descripcion: 'Colección de arte moderno y contemporáneo colombiano en el campus de la UPB.',
    categoria: 'arte',
    isSena: false,
    tokens: ['museo', 'upb', 'arte', 'robledo', 'exposiciones'],
    img: 'img/lugares/arte.svg',
    alt: 'Museo UPB'
  },
  {
    id: 'cinemateca-municipal',
    nombre: 'Cinemateca Municipal',
    sector: 'Medellín, centro (Plaza de la Libertad)',
    descripcion: 'Sala de cine de autor y retrospectivas que promueve el lenguaje audiovisual y el arte del cine.',
    categoria: 'arte',
    isSena: false,
    tokens: ['cinemateca', 'cine', 'peliculas', 'arte'],
    img: 'img/lugares/arte-2.svg',
    alt: 'Cinemateca Municipal'
  },
  {
    id: 'galeria-de-arte-deseos',
    nombre: 'Galería de Arte del Parque de los Deseos',
    sector: 'Medellín, Aranjuez',
    descripcion: 'Espacio expositivo dentro del Parque de los Deseos con muestras de artistas de la ciudad.',
    categoria: 'arte',
    isSena: false,
    tokens: ['galeria', 'parque de los deseos', 'arte', 'exposiciones'],
    img: 'img/lugares/arte.svg',
    alt: 'Galería de Arte del Parque de los Deseos'
  },
  {
    id: 'instituto-bellas-artes',
    nombre: 'Instituto de Bellas Artes',
    sector: 'Medellín, centro',
    descripcion: 'Institución para la formación artística en música, artes plásticas y escénicas.',
    categoria: 'arte',
    isSena: false,
    tokens: ['bellas artes', 'arte', 'musica', 'formacion'],
    img: 'img/lugares/arte-2.svg',
    alt: 'Instituto de Bellas Artes'
  },
  {
    id: 'cementerio-museo-san-pedro',
    nombre: 'Cementerio Museo San Pedro',
    sector: 'Medellín, centro',
    descripcion: 'Cementerio patrimonial con esculturas y arquitectura que funciona como museo a cielo abierto.',
    categoria: 'arte',
    isSena: false,
    tokens: ['cementerio', 'san pedro', 'museo', 'esculturas', 'patrimonio'],
    img: 'img/lugares/arte.svg',
    alt: 'Cementerio Museo San Pedro'
  },
  {
    id: 'casa-teatro-el-poblado',
    nombre: 'Casa Teatro El Poblado',
    sector: 'Medellín, El Poblado',
    descripcion: 'Sala de teatro independiente y espacio cultural con obras y talleres en El Poblado.',
    categoria: 'arte',
    isSena: false,
    tokens: ['casa teatro', 'poblado', 'teatro', 'arte'],
    img: 'img/lugares/arte-2.svg',
    alt: 'Casa Teatro El Poblado'
  },
  {
    id: 'palacio-de-la-cultura',
    nombre: 'Palacio de la Cultura Rafael Uribe Uribe',
    sector: 'Medellín, centro',
    descripcion: 'Edificio patrimonial del centro con salas de exposiciones y eventos culturales.',
    categoria: 'arte',
    isSena: false,
    tokens: ['palacio de la cultura', 'exposiciones', 'arquitectura', 'arte'],
    img: 'img/lugares/arte.svg',
    alt: 'Palacio de la Cultura'
  }
];

/* ============================================================
   LUGARES_BUSCADOR — Lugares adicionales SOLO para búsqueda
   ------------------------------------------------------------
   Mismo esquema y taxonomía de LUGARES_BECI, pero NO aparecen en
   las listas de los filtros del Home (ahí se mantienen ~15 por
   categoría). Se agregan para que lugares reales muy buscados
   (CESDE, UNIMINUTO, universidades, clínicas, etc.) aparezcan al
   buscar, aunque no estén pre-listados en los filtros.
   ============================================================ */

var LUGARES_BUSCADOR = [

  /* ---------- Universidades e instituciones educativas ---------- */
  {
    id: 'cesde',
    nombre: 'CESDE (Centro de Estudios Superiores)',
    sector: 'Medellín, centro (Calle 49 # 41-9)',
    descripcion: 'Centro de Estudios Superiores con formación técnica laboral y programas técnicos en áreas empresariales, de salud y nuevas tecnologías.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['cesde', 'centro de estudios superiores', 'formacion tecnica', 'tecnicos laborales', 'estudios'],
    img: 'img/lugares/educativos.svg',
    alt: 'CESDE Medellín'
  },
  {
    id: 'uniminuto',
    nombre: 'UNIMINUTO (Corporación Universitaria Minuto de Dios)',
    sector: 'Bello, La Gabriela (Km 0 Autopista Medellín-Bogotá)',
    descripcion: 'Seccional Antioquia-Chocó de la Corporación Universitaria Minuto de Dios, con programas profesionales, tecnológicos y posgrados a unos minutos de la estación de metro de Bello.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['uniminuto', 'minuto de dios', 'corporacion universitaria', 'bello', 'universidad'],
    img: 'img/lugares/educativos-2.svg',
    alt: 'UNIMINUTO Bello'
  },
  {
    id: 'universidad-de-medellin',
    nombre: 'Universidad de Medellín (UdeM)',
    sector: 'Medellín, Belén Los Alpes (Cra 87 # 30-65)',
    descripcion: 'Universidad privada del suroccidente de Medellín, con una estación de Metroplús frente al campus y programas de pregrado, posgrado y extensión cultural.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['udem', 'universidad de medellin', 'belen', 'los alpes', 'metroplus'],
    img: 'img/lugares/educativos.svg',
    alt: 'Universidad de Medellín'
  },
  {
    id: 'universidad-eia',
    nombre: 'Universidad EIA',
    sector: 'Envigado, Las Palmas (Calle 23AA Sur # 5-200)',
    descripcion: 'Universidad de ingeniería y negocios fundada en 1978, con campus verde en la variante Las Palmas y énfasis en ciencia, tecnología e innovación.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['eia', 'escuela de ingenieria', 'envigado', 'las palmas', 'ingenieria'],
    img: 'img/lugares/educativos-2.svg',
    alt: 'Universidad EIA'
  },
  {
    id: 'ces',
    nombre: 'Institución Universitaria CES',
    sector: 'Medellín, El Poblado (Calle 10A # 22-04)',
    descripcion: 'Institución universitaria referente en medicina y ciencias de la salud, con campus en El Poblado y consultorios de atención a la comunidad.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['ces', 'institucion universitaria ces', 'medicina', 'salud', 'pregrados', 'poblado'],
    img: 'img/lugares/educativos.svg',
    alt: 'Institución Universitaria CES'
  },
  {
    id: 'remington',
    nombre: 'Corporación Universitaria Remington (Uniremington)',
    sector: 'Medellín, centro (Parque Berrío, Calle 51 # 51-27)',
    descripcion: 'Corporación Universitaria Remington (Uniremington), con su sede central frente al Parque Berrío, en pleno centro de Medellín.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['remington', 'uniremington', 'corporacion universitaria', 'parque berrio', 'centro'],
    img: 'img/lugares/educativos-2.svg',
    alt: 'Uniremington'
  },
  {
    id: 'colegio-mayor',
    nombre: 'Institución Universitaria Colegio Mayor de Antioquia',
    sector: 'Medellín, Robledo (Cra 78 # 65-46)',
    descripcion: 'Institución Universitaria Colegio Mayor de Antioquia (Colmayor), con campus fundacional en el barrio Robledo.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['colegio mayor', 'colmayor', 'institucion universitaria', 'robledo'],
    img: 'img/lugares/educativos.svg',
    alt: 'Colegio Mayor de Antioquia'
  },
  {
    id: 'tecnologico-de-antioquia',
    nombre: 'Tecnológico de Antioquia (TdeA)',
    sector: 'Medellín, Robledo (Calle 78B # 72A-220)',
    descripcion: 'Tecnológico de Antioquia (TdeA), institución universitaria pública con ciudadela de 40 000 m² en el barrio Robledo.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['tdea', 'tecnologico de antioquia', 'robledo', 'institucion publica', 'tecnologia'],
    img: 'img/lugares/educativos-2.svg',
    alt: 'Tecnológico de Antioquia'
  },
  {
    id: 'universidad-luis-amigo',
    nombre: 'Universidad Católica Luis Amigó',
    sector: 'Medellín, La América (Transv. 51A # 67B-90)',
    descripcion: 'Universidad Católica Luis Amigó (antes Funcafull), con pregrados y posgrados en ciencias sociales, salud, ingenierías y arquitectura.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['luis amigo', 'funlam', 'funcafull', 'universidad catolica', 'la america'],
    img: 'img/lugares/educativos.svg',
    alt: 'Universidad Católica Luis Amigó'
  },
  {
    id: 'lasallista',
    nombre: 'Corporación Universitaria Lasallista',
    sector: 'Caldas, Antioquia (Cra 51 # 118 Sur # 57)',
    descripcion: 'Universidad Lasallista (Unilasallista), con campus al sur del Valle de Aburrá, fuerte en medicina veterinaria, administración e ingenierías.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['lasallista', 'unilasallista', 'caldas', 'veterinaria', 'campus'],
    img: 'img/lugares/educativos-2.svg',
    alt: 'Unilasallista'
  },
  {
    id: 'esumer',
    nombre: 'Institución Universitaria Esumer',
    sector: 'Medellín, Robledo (Calle 76 # 80-126)',
    descripcion: 'Institución Universitaria Esumer, con programas en mercadeo, negocios internacionales y turismo.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['esumer', 'institucion universitaria', 'mercadeo', 'negocios', 'robledo'],
    img: 'img/lugares/educativos.svg',
    alt: 'Institución Universitaria Esumer'
  },
  {
    id: 'politecnico-jic',
    nombre: 'Politécnico Colombiano Jaime Isaza Cadavid',
    sector: 'Medellín, El Poblado (Cra 48 # 7-151)',
    descripcion: 'Institución pública adscrita a la Gobernación de Antioquia, con campus central al sur de Medellín y programas en ingenierías, agraria, deporte y comunicación.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['politecnico', 'jaime isaza cadavid', 'elpoli', 'agraria', 'deporte', 'el poblado'],
    img: 'img/lugares/educativos-2.svg',
    alt: 'Politécnico Jaime Isaza Cadavid'
  },
  {
    id: 'colegiatura',
    nombre: 'Colegiatura Colombiana',
    sector: 'Medellín, El Poblado (Km 7 vía Las Palmas)',
    descripcion: 'Institución de educación superior y bachillerato en el Km 7 de la vía Las Palmas, reconocida por diseño de modas y creatividad.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['colegiatura', 'colegiatura colombiana', 'las palmas', 'diseno de modas', 'el poblado'],
    img: 'img/lugares/educativos.svg',
    alt: 'Colegiatura Colombiana'
  },
  {
    id: 'institucion-universitaria-envigado',
    nombre: 'Institución Universitaria de Envigado (IUE)',
    sector: 'Envigado, centro (Cra 43B # 40-97)',
    descripcion: 'Institución Universitaria de Envigado (IUE), universidad pública municipal con pregrados, posgrados y deporte.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['iue', 'institucion universitaria de envigado', 'envigado', 'universidad publica'],
    img: 'img/lugares/educativos-2.svg',
    alt: 'Institución Universitaria de Envigado'
  },
  {
    id: 'colegio-san-jose-de-la-salle',
    nombre: 'Colegio San José de la Salle',
    sector: 'Medellín, centro (Calle 42 # 46-24)',
    descripcion: 'Tradicional colegio de la comunidad de La Salle en el centro de Medellín, con formación académica y humana desde el preescolar hasta la media.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['san jose de la salle', 'la salle', 'colegio', 'centro'],
    img: 'img/lugares/educativos.svg',
    alt: 'Colegio San José de la Salle'
  },
  {
    id: 'centro-colombo-americano',
    nombre: 'Centro Colombo Americano',
    sector: 'Medellín, centro (Cra 45 # 53-24)',
    descripcion: 'Centro de enseñanza de inglés y cultura estadounidense, referente de programas de idiomas en Medellín.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['colombo americano', 'ingles', 'idiomas', 'cultura americana', 'centro'],
    img: 'img/lugares/educativos-2.svg',
    alt: 'Centro Colombo Americano'
  },
  {
    id: 'colegio-montessori',
    nombre: 'Colegio Montessori',
    sector: 'Medellín, El Poblado',
    descripcion: 'Institución educativa bilingüe con tradición en El Poblado, desde preescolar hasta educación media.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['montessori', 'colegio', 'bilingue', 'el poblado'],
    img: 'img/lugares/educativos.svg',
    alt: 'Colegio Montessori'
  },
  {
    id: 'colegio-aleman',
    nombre: 'Colegio Alemán de Medellín',
    sector: 'Medellín, El Poblado (Los Balsos)',
    descripcion: 'Colegio Alemán de Medellín, institución trilingüe con certificación internacional y programa de bachillerato alemán.',
    categoria: 'educativos',
    isSena: false,
    tokens: ['colegio aleman', 'aleman', 'bilingue', 'trilingue', 'los balsos'],
    img: 'img/lugares/educativos-2.svg',
    alt: 'Colegio Alemán de Medellín'
  },

  /* ---------- Salud ---------- */
  {
    id: 'clinica-somer',
    nombre: 'Clínica Somer',
    sector: 'Rionegro, centro (Cra 51A # 15-30)',
    descripcion: 'Red hospitalaria del oriente antioqueño con servicios de alta complejidad, sede principal en Rionegro.',
    categoria: 'salud',
    isSena: false,
    tokens: ['somer', 'clinica', 'rionegro', 'oriente antioqueno', 'hospital'],
    img: 'img/lugares/salud.svg',
    alt: 'Clínica Somer'
  },
  {
    id: 'hospital-mental-antioquia',
    nombre: 'Hospital Mental de Antioquia',
    sector: 'Bello (Av. El Recreo)',
    descripcion: 'Centro especializado de salud mental y psiquiatría de Antioquia, con sede en Bello.',
    categoria: 'salud',
    isSena: false,
    tokens: ['hospital mental', 'salud mental', 'psiquiatria', 'bello'],
    img: 'img/lugares/salud-2.svg',
    alt: 'Hospital Mental de Antioquia'
  },
  {
    id: 'clinica-ces',
    nombre: 'Clínica CES',
    sector: 'Medellín, El Poblado (Calle 10A # 22-04)',
    descripcion: 'Centro hospitalario universitario de la Institución Universitaria CES, con consulta externa y urgencias en El Poblado.',
    categoria: 'salud',
    isSena: false,
    tokens: ['clinica ces', 'ces', 'hospital', 'poblado', 'salud'],
    img: 'img/lugares/salud.svg',
    alt: 'Clínica CES'
  },

  /* ---------- Cultura ---------- */
  {
    id: 'teatro-matacandelas',
    nombre: 'Teatro Matacandelas',
    sector: 'Medellín, centro (Calle 47 # 43-47)',
    descripcion: 'Sala independiente de teatro en la esquina de Bomboná con Girardot, con temporadas de repertorio y talleres.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['matacandelas', 'teatro', 'bombona', 'girardot', 'independiente'],
    img: 'img/lugares/cultura.svg',
    alt: 'Teatro Matacandelas'
  },
  {
    id: 'museo-del-agua-epm',
    nombre: 'Museo del Agua EPM',
    sector: 'Medellín, centro (La Alpujarra)',
    descripcion: 'Museo interactivo de EPM sobre el agua, los ecosistemas y el medio ambiente, en el complejo de La Alpujarra.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['museo del agua', 'agua', 'epm', 'alpujarra', 'interactivo'],
    img: 'img/lugares/cultura-2.svg',
    alt: 'Museo del Agua EPM'
  },
  {
    id: 'otraparte',
    nombre: 'Casa Museo Otraparte',
    sector: 'Envigado, centro (Cra 27 # 25-28)',
    descripcion: 'Casa museo y centro cultural que preserva el legado del filósofo y escritor Fernando González en Envigado.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['otraparte', 'fernando gonzalez', 'casa museo', 'envigado', 'filosofia'],
    img: 'img/lugares/cultura.svg',
    alt: 'Casa Museo Otraparte'
  },
  {
    id: 'catedral-metropolitana',
    nombre: 'Catedral Basílica Metropolitana',
    sector: 'Medellín, centro (Parque Bolívar)',
    descripcion: 'Una de las iglesias de ladrillo más grandes del mundo, frente al Parque Bolívar, en el corazón cultural del centro.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['catedral', 'catedral metropolitana', 'basilica', 'parque bolivar', 'iglesia'],
    img: 'img/lugares/cultura-2.svg',
    alt: 'Catedral Basílica Metropolitana'
  },
  {
    id: 'plaza-botero',
    nombre: 'Plaza Botero',
    sector: 'Medellín, centro',
    descripcion: 'Espacio público contiguo al Museo de Antioquia con 23 esculturas de bronce donadas por el maestro Fernando Botero.',
    categoria: 'cultura',
    isSena: false,
    tokens: ['plaza botero', 'botero', 'esculturas', 'centro', 'arte urbano'],
    img: 'img/lugares/cultura.svg',
    alt: 'Plaza Botero'
  },

  /* ---------- Institucionales ---------- */
  {
    id: 'area-metropolitana',
    nombre: 'Área Metropolitana del Valle de Aburrá',
    sector: 'Medellín, centro (Cra 53 # 40A-110)',
    descripcion: 'Autoridad ambiental y de transporte metropolitano que articula los 10 municipios del Valle de Aburrá.',
    categoria: 'institucionales',
    isSena: false,
    tokens: ['area metropolitana', 'valle de aburra', 'ambiente', 'transporte', 'metropolitana'],
    img: 'img/lugares/institucionales.svg',
    alt: 'Área Metropolitana del Valle de Aburrá'
  },

  /* ---------- Deportivos ---------- */
  {
    id: 'ud-san-javier',
    nombre: 'Unidad Deportiva San Javier',
    sector: 'Medellín, San Javier',
    descripcion: 'Unidad deportiva con canchas y espacios para la práctica del deporte y la recreación en la comuna 13.',
    categoria: 'deportivos',
    isSena: false,
    tokens: ['unidad deportiva san javier', 'san javier', 'deportes', 'canchas', 'comuna 13'],
    img: 'img/lugares/deportivos.svg',
    alt: 'Unidad Deportiva San Javier'
  },

  /* ---------- Recreativos ---------- */
  {
    id: 'parque-tucan',
    nombre: 'Parque Tucán',
    sector: 'Medellín, El Poblado (Cm 7 vía Las Palmas)',
    descripcion: 'Club de recreación familiar con piscinas, toboganes y zonas verdes sobre la vía Las Palmas.',
    categoria: 'recreativos',
    isSena: false,
    tokens: ['tucan', 'parque de diversiones', 'piscina', 'recreacion', 'las palmas', 'toboganes'],
    img: 'img/lugares/recreativos.svg',
    alt: 'Parque Tucán'
  },
  {
    id: 'zoologico-santa-fe',
    nombre: 'Zoológico Santa Fe',
    sector: 'Sabaneta, sur del Valle de Aburrá',
    descripcion: 'Hogar de más de 1000 animales de 200 especies en un bosque natural al sur del Valle de Aburrá.',
    categoria: 'recreativos',
    isSena: false,
    tokens: ['zoologico', 'santa fe', 'animales', 'sabaneta', 'naturaleza'],
    img: 'img/lugares/recreativos-2.svg',
    alt: 'Zoológico Santa Fe'
  }
];