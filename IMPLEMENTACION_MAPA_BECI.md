# Implementación del Mapa Interactivo BECI (Ubicación)

Guía para desplegar y mantener el mapa interactivo de la pantalla **Ubicate** sin depender de una API de mapas de pago ni de claves/`billing`.

## Stack (100 % gratuito, sin API key)

| Servicio | Uso | URL |
|---|---|---|
| **Leaflet 1.9.4** | Librería de mapa | `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css` / `leaflet.js` |
| **OpenStreetMap tiles** | Mosaicos del mapa base | `https://tile.openstreetmap.org/{z}/{x}/{y}.png` |
| **Overpass API** | Lugares cercanos (colegios, SENA, parques, museos…) | `https://overpass-api.de/api/interpreter` |
| **Nominatim** | Búsqueda de un lugar por nombre (Enter) | `https://nominatim.openstreetmap.org/search` |
| **OSRM público** | Distancia caminando en ruta real | `https://router.project-osrm.org/route/v1/foot/...` |
| **Geolocalización** | Ubicación del usuario | API del navegador (`navigator.geolocation`) |

No se requiere clave. Lo único obligatorio es **conexión a internet**.

## Archivo afectado

- `Ubicate.html` — contiene todo el componente (CSS encapsulado, HTML y JS).

El componente vive entre los marcadores:

```
<!-- BEGIN: Interactive Map Area -->
...
<!-- BEGIN: Beci Interactive Map Component (Leaflet + OpenStreetMap) -->
...
<!-- END: Beci Interactive Map Component -->
```

El JS principal está en las etiquetas:

```
<!-- BEGIN: Beci Interactive Map Component JS -->
<script data-purpose="beci-map-component"> ... </script>
<!-- END: Beci Interactive Map Component JS -->
```

## Estructura del componente

- **Mapa**: `<div id="beci-map">` (contiene el mapa Leaflet a pantalla completa).
- **Buscador**: `<input id="beci-map-search-input">` — la búsqueda se dispara con **Enter o la lupa**.
- **Botón ubicación**: `<button id="beci-location-btn">` — vuelve a tu posición y recarga lugares.
- **Tarjeta emergente**: aparece al **pulsar un pin** (`showPinCard`); crece desde el pin con foto, nombre, categoría, distancia y estado. No hay lista lateral/inferior de tarjetas.
- **Toast de estado**: `<div id="beci-map-status">` — mensajes de carga/error en español.

## Cómo funciona (flujo principal)

1. Al abrir la pantalla se pide permisos de ubicación.
2. Si se acepta, el mapa vuela a tu posición y muestra el punto rosa **"Estás aquí"**.
3. Se consulta **Overpass** en un radio de **1500 m** buscando:
   - `amenity`: school, university, college, library, community_centre, arts_centre, training
   - `tourism`: museum, attraction, gallery, theme_park, zoo
   - `leisure`: park, garden, sports_centre, stadium, fitness_centre, pitch, playground
   - `sport` en general
   - objetos cuyo **nombre** contenga "sena" (para asegurar que el SENA siempre aparezca)
4. Los resultados se filtran, se ordenan por distancia y se quedan los **15 más cercanos** como pines en el mapa:
   - **Pin VERDE** → es una sede SENA.
   - **Pin NARANJA** → otro lugar relevante.
   - Foto placeholder por categoría (emoji) en la tarjeta emergente.
   - Distancia caminando calculada con **OSRM** (línea recta como respaldo si falla).
5. Las **píldoras de categoría** filtran los pines y el mapa se **re-centra** sobre ellos; además abre la tarjeta del primer lugar de esa categoría y muestra el conteo ("Todos" vuelve a tu posición).
6. Al **pulsar un pin** el pin cambia a azul oscuro y aparece la tarjeta animada que crece desde el pin con datos básicos y estado (verde/naranja); **tocarla navega** a su página de detalle. La tarjeta se cierra con ×, al tocar el mapa, al buscar o al filtrar.
7. La **búsqueda** se ejecuta con **Enter o pulsando la lupa** y cubre **mínimo 5 km** alrededor de tu posición (o del centro de Medellín si no hay GPS):
   1. Si el texto contiene **"sena"** → muestra **TODAS las sedes SENA registradas** en `beci-data.js` (7 pines, mapa ajustado a todas y tarjeta de la primera).
   2. Si no, filtra los lugares ya cargados por nombre; si hay coincidencia muestra la tarjeta y **centra el mapa**.
   3. Si no, consulta **Overpass** por nombre en un radio de 5 km (`SEARCH_RADIUS_METERS`) y muestra los resultados con sus tarjetas.
   4. Si no encuentra nada, busca en **Nominatim** (área Medellín), añade el pin y abre su tarjeta.
8. El botón **"mi ubicación"** (⊕) re-ubica y recarga los lugares cercanos con feedback visual mientras localiza.

## Configuración (constantes al inicio del JS)

```js
var MEDELLIN = { lat: 6.2442, lng: -75.5812 };  // centro y zoom inicial
var NEARBY_RADIUS_METERS = 1500;                // radio de carga inicial (lugares cercanos)
var SEARCH_RADIUS_METERS = 5000;                // radio mínimo de la búsqueda (≥ 5 km)
var MAX_PLACES = 15;                            // máx. lugares mostrados
var MAX_DISTANCE_BATCH = 4;                     // OSRM en lotes de 4
var SENA_PAGE = 'TrabajaconBeci.html';          // plantilla dinámica SENA
var REGULAR_PAGE = 'NoTrabajaconBeci.html';     // plantilla dinámica no-SENA
var SENA_SEDES_DATA = window.SENA_SEDES;        // datos de sedes (beci-data.js)
```

## Datos de las sedes SENA — `beci-data.js` (archivo de datos)

Es la **fuente única** de las sedes SENA de Medellín, compartida por:

- **`Ubicate.html`** (cargado en el `<head>`) → decide a qué sede navega cada tarjeta SENA.
- **`TrabajaconBeci.html`** (cargado en el `<head>`) → renderiza la sede según la URL.

```js
var SENA_SEDES = {
  "complejo-norte": {
    nombre: "Complejo Norte",
    sector: "Medellín, Pedregal (Autopista Norte)",
    descripcion: "...",
    tokens: ["complejo norte", "complejo sena", "sena norte", "pedregal"],
    pills: ["Aprender", "Crear", "Crecer"],
    lat: 6.3022365,   // Coordenadas OSM (mapa)
    lng: -75.5682972,
    img: "...", // imagen hero placeholder
    alt: "Complejo Sena Norte"
  },
  // ... más sedes
};
```

Para editar sedes: agrega/cambia un objeto aquí y se actualizan mapa y detalle. Los `tokens` emparejan el nombre del lugar (OSM) con la sede (se ignoran acentos y mayúsculas). Las coordenadas **`lat` / `lng`** son las que usa el mapa; al buscar **"sena"** en `Ubicate.html` aparecen **todas** las sedes con coordenadas registradas.

## Navegación de tarjetas (definitiva)

Cada tarjeta navega **siempre**:

| Tipo de tarjeta | Va a | Detalle |
|---|---|---|
| **SENA** (indicador verde) | `TrabajaconBeci.html?sede=<clave>` | Si el nombre no coincide con ninguna sede del registro, cae al mismo archivo con `?lugar=<nombre>` |
| **No SENA** (indicador naranja) | `NoTrabajaconBeci.html?lugar=<nombre>` | La página muestra el nombre del lugar tocado |

Las plantillas son **dinámicas**: leen la URL y rellenan título, ubicación, descripción y cápsulas en vivo. No se crean archivos estáticos por sede.

## Personalizar lugares y categorías

Lógica en `CATEGORY_RULES` (JS):

- **Añadir/reordenar categorías**: cada regla tiene `key`, un `matchTag` (por etiquetas OSM) y un regex sobre el nombre.
- **Fotos placeholder**: mapa `CATEGORY_EMOJI` con el emoji de cada categoría. La función `getCategoryPhoto(category)` genera el SVG.
- **Ignorar lugares**: lista `BLACKLIST_NAME` (direcciones, farmacias, iglesias, etc.).
- **Colores de pines**: `placePinSvg('#8A56AC')` (normal) y `placePinSvg('#062573')` (resaltado).

## Ejecución local

```bash
python3 -m http.server 8000
# abre: http://localhost:8000/Ubicate.html
```

> La geolocalización del navegador solo funciona en **contexto seguro**: `https://` o `localhost`. Si se abre como `file://` o se deniega el permiso, el mapa **hace fallback** y muestra los lugares alrededor de Medellín (sin el punto de ubicación).

## Despliegue (producción)

1. Sube la carpeta a un host con HTTPS: Netlify, GitHub Pages, Vercel, etc.
2. Ajusta el contenido de las sedes en `beci-data.js` (datos básicos editables: sector, descripción, imágenes placeholder).
3. Verifica en móvil y escritorio (la pantalla está diseñada sin scroll: solo el mapa se desplaza).

## Límites de los servicios públicos (importante)

- **Overpass, Nominatim y OSRM públicos** son para uso moderado/demo. Con poco tráfico funcionan bien; para un producto con muchos usuarios:
  - Levanta tu propio **Overpass** o usa un proveedor de Overpass dedicado.
  - Cumple la **política de uso de Nominatim** (uso medio máx. 1 req/s, con `User-Agent` identificable) o migra a tu propio Nominatim.
  - OSRM: despliega tu propio router (perfil `foot`) si el volumen lo requiere.
- Los **tiles de OSM** exigen respetar su política de uso y mostrar la atribución (ya incluida).

## Solución de problemas

| Problema | Causa / solución |
|---|---|
| Mapa gris o vacío | Sin conexión o el CDN de Leaflet no carga. Revisa consola. |
| Al buscar **"sena"** solo aparece una sede | Resuelto: un texto que contenga "sena" muestra siempre **todas** las sedes con `lat`/`lng` de `beci-data.js` (`searchSenaSedes`). |
| Al buscar un lugar no aparece nada en los primeros 5 km | La búsqueda usa `SEARCH_RADIUS_METERS` (5000) en Overpass por nombre; si no hay datos OSM con ese nombre, cae a Nominatim. |
| El buscador no hace nada | La búsqueda corre al pulsar **Enter o la lupa**. Verifica el tipo de cambio de inputs y que `el.searchIcon` exista en consola. |
| No aparece "Estás aquí" | Permisos denegados o abierto como `file://`. Usa `localhost` o HTTPS. |
| Faltan algunos lugares cercanos | Overpass depende de datos mapeados en OSM. Amplía `NEARBY_RADIUS_METERS` o añade etiquetas a la consulta Overpass en `findNearbyPlaces`. |
| Distancia "0" o rara | Se usa ETA recta de respaldo si OSRM falla; es esperado en rutas sin datos. |
| La tarjeta no navega | Cada tarjeta navega siempre; si no carga la página revisa las rutas `SENA_PAGE` / `REGULAR_PAGE` y la presencia de `beci-data.js`. |
| La sede SENA muestra contenido genérico | El nombre del lugar no coincide con `tokens` de `beci-data.js`; agrega el token o un `sede` específico. |
| Sin ubicación no hay lugares | Desde esta versión hay *fallback*: al denegar permisos se cargan los lugares de Medellín (centro 6.2442, -75.5812). |