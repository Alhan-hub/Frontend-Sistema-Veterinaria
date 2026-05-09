# Frontend — Sistema de Gestión Veterinaria

Cliente web en **Angular** con **Angular Material** que consume la API REST del backend **FastAPI** (`Backend-Sistema-Veterinaria`). Incluye **login de demostración**, **layout con menú lateral colapsable** y **CRUD** por cada entidad expuesta en el API.

---

## Tabla de contenidos

1. [Video demostrativo](#video-demostrativo)
2. [Stack tecnológico](#stack-tecnológico)
3. [Requisitos previos](#requisitos-previos)
4. [Estructura de carpetas del repositorio](#estructura-de-carpetas-del-repositorio)
5. [Cómo obtener el proyecto (clonar o copiar)](#cómo-obtener-el-proyecto-clonar-o-copiar)
6. [Instalación paso a paso](#instalación-paso-a-paso)
7. [Configuración de la URL del API](#configuración-de-la-url-del-api)
8. [Cómo ejecutar en desarrollo](#cómo-ejecutar-en-desarrollo)
9. [Cómo compilar para producción](#cómo-compilar-para-producción)
10. [Arquitectura de la aplicación Angular](#arquitectura-de-la-aplicación-angular)
11. [Rutas y navegación](#rutas-y-navegación)
12. [Componentes y convenciones](#componentes-y-convenciones)
13. [Servicios HTTP y modelos](#servicios-http-y-modelos)
14. [Autenticación y usuario de auditoría](#autenticación-y-usuario-de-auditoría)
15. [Integración con el backend (CORS)](#integración-con-el-backend-cors)
16. [Problemas frecuentes](#problemas-frecuentes)

---

## Video demostrativo

El siguiente video muestra la ejecución del frontend en entorno local, la interacción con el backend y la operación completa de todos los CRUD con persistencia en la base de datos:

[Ver video en YouTube](https://youtu.be/HDqiVpvZVRE)

---

## Stack tecnológico

| Tecnología | Uso |
|------------|-----|
| **Angular 20** | Framework SPA, componentes standalone, signals donde aplica |
| **TypeScript** | Lenguaje del proyecto |
| **Angular Material 20** | UI: tablas, formularios, diálogos, sidenav, toolbar, temas M3 |
| **RxJS** | Observables en llamadas HTTP |
| **Angular Router** | Rutas, lazy loading, `withViewTransitions()` |
| **HttpClient** | Cliente REST hacia FastAPI |

El código de la aplicación vive en la carpeta **`web/`**. En la raíz de este repositorio hay un `package.json` mínimo que **reenvía** los comandos a `web/` para poder ejecutar `npm start` sin entrar en `web`.

---

## Requisitos previos

- **Node.js** LTS (recomendado v20 o v22): [https://nodejs.org](https://nodejs.org)
- **npm** (viene con Node)
- Opcional: **Angular CLI** global (`npm install -g @angular/cli`) — no es obligatorio si usas `npx ng` o los scripts de `package.json`

Comprueba versiones:

```bash
node -v
npm -v
```

---

## Estructura de carpetas del repositorio

```
Frontend-Sistema-Veterinaria/               ← Raíz del repo (scripts npm cómodos)
├── package.json                            ← Delega start/build/test a web/
├── README.md                               ← Este archivo
└── web/                                    ← Proyecto Angular real
    ├── angular.json
    ├── package.json                        ← Dependencias y scripts ng
    ├── tsconfig.json
    ├── src/
    │   ├── index.html
    │   ├── main.ts
    │   ├── styles.scss                     ← Tema Material + estilos globales
    │   ├── environments/
    │   │   ├── environment.ts              ← Desarrollo (apiUrl)
    │   │   └── environment.prod.ts         ← Producción (reemplazo en build prod)
    │   └── app/
    │       ├── app.ts                      ← Raíz: solo <router-outlet />
    │       ├── app.html
    │       ├── app.config.ts               ← HttpClient, animaciones, router + view transitions
    │       ├── app.routes.ts               ← Rutas y lazy loading
    │       ├── models/
    │       │   └── api.models.ts           ← Interfaces TypeScript alineadas al API
    │       ├── core/
    │       │   ├── audit-context.service.ts
    │       │   ├── audit-user.guard.ts
    │       │   └── services/               ← Un servicio por entidad (HTTP)
    │       │       ├── usuario.service.ts
    │       │       ├── propietario.service.ts
    │       │       ├── mascota.service.ts
    │       │       ├── cita.service.ts
    │       │       ├── vacuna.service.ts
    │       │       └── factura.service.ts
    │       ├── shared/
    │       │   └── ids.ts                  ← Utilidad para mostrar UUIDs cortos
    │       └── features/
    │           ├── login/                  ← Pantalla de acceso
    │           ├── shell/                  ← Layout: sidenav + toolbar + outlet
    │           ├── usuarios/               ← Lista + diálogo CRUD
    │           ├── propietarios/           ← Lista + diálogo CRUD
    │           ├── mascotas/               ← Lista + diálogo CRUD
    │           ├── citas/                  ← Lista + diálogo CRUD
    │           ├── vacunas/                ← Lista + diálogo CRUD
    │           └── facturas/               ← Lista + diálogo CRUD
    └── public/
        └── favicon.ico
```

Cada carpeta bajo **`features/<entidad>/`** sigue el mismo patrón:

- **`<entidad>-list.ts|html|scss`**: pantalla con `mat-table`, paginador, botones y apertura de diálogo.
- **`<entidad>-dialog.ts|html`**: formulario en `MatDialog` para crear/editar.

---

## Cómo obtener el proyecto (clonar o copiar)

### Opción A — Clonar con Git

```bash
git clone <URL-del-repositorio> Frontend-Sistema-Veterinaria
cd Frontend-Sistema-Veterinaria
```

### Opción B — Copiar carpeta (USB, zip, Drive)

1. Copia toda la carpeta **`Frontend-Sistema-Veterinaria`** (incluyendo **`web/`**).
2. No hace falta copiar **`web/node_modules`** si vas a ejecutar `npm install` de nuevo (recomendado).
3. Abre una terminal en **`Frontend-Sistema-Veterinaria`** (raíz) o directamente en **`web/`**.

---

## Instalación paso a paso

Desde la **raíz** del frontend (recomendado):

```bash
cd Frontend-Sistema-Veterinaria
cd web
npm install
```

O en un solo paso:

```bash
cd Frontend-Sistema-Veterinaria/web && npm install
```

Esto instala Angular, Material, CDK, etc. según **`web/package.json`**.

---

## Configuración de la URL del API

La base del API se define en:

- **`web/src/environments/environment.ts`** (desarrollo por defecto al hacer `ng serve`)
- **`web/src/environments/environment.prod.ts`** (sustituye al anterior en **`ng build` de producción**)

Ejemplo desarrollo:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000',
};
```

Cambia **`apiUrl`** si tu FastAPI corre en otro host o puerto. Los servicios en **`core/services/`** concatenan rutas como `${environment.apiUrl}/mascotas/`, etc.

---

## Cómo ejecutar en desarrollo

1. Arranca el **backend** FastAPI (puerto **8000** por defecto).
2. En una terminal, desde **`web/`**:

```bash
cd web
npm start
```

O desde la **raíz** del repo frontend:

```bash
npm start
```

3. Abre el navegador en **http://localhost:4200**.

---

## Cómo compilar para producción

```bash
cd web
npm run build
```

Salida típica: **`web/dist/web/`**.

Para servir esa carpeta con un servidor estático:

```bash
npx --yes serve -s dist/web/browser -l 8080
```

---

## Arquitectura de la aplicación Angular

### Arranque

- **`main.ts`**: arranca la aplicación con `bootstrapApplication(App, appConfig)`.
- **`app.config.ts`**:
  - `provideHttpClient()` para llamadas REST.
  - `provideAnimationsAsync()` para animaciones de Material.
  - `provideRouter(routes, withViewTransitions())` para transiciones suaves entre rutas.

### Raíz

- **`app.ts`**: componente raíz con **solo** `<router-outlet />` — no hay lógica de negocio aquí.

### Carga perezosa (lazy loading)

Las rutas cargan componentes con **`loadComponent`** para que cada pantalla sea un **chunk** separado y la primera carga sea más liviana.

---

## Rutas y navegación

| Ruta | Descripción |
|------|-------------|
| `/` | Redirige a `/login` |
| `/login` | Login de demostración o alta del primer usuario |
| `/app` | Layout principal (requiere usuario de auditoría en `localStorage`) |
| `/app/usuarios` | CRUD usuarios |
| `/app/propietarios` | CRUD propietarios |
| `/app/mascotas` | CRUD mascotas |
| `/app/citas` | CRUD citas |
| `/app/vacunas` | CRUD vacunas |
| `/app/facturas` | CRUD facturas |
| `**` | Cualquier otra ruta → `/login` |

La ruta `/app` está protegida por **`auditUserGuard`**: si no hay UUID de usuario de auditoría guardado, redirige al login.

---

## Componentes y convenciones

### `features/login`

- Formulario **usuario + contraseña** (la clave no se valida contra el servidor; solo debe existir el `nombre_usuario` en `GET /usuarios/`).
- Si no hay usuarios registrados, muestra formulario para **crear el primero** (POST).

### `features/shell/main-layout`

- **`mat-sidenav-container`** con **`autosize`**: recalcula el margen del contenido cuando el menú cambia de ancho.
- Menú lateral con iconos, estado colapsado persistido en **`localStorage`** (`shell_sidebar_collapsed`).
- Barra superior: selector de **usuario de auditoría** y cierre de sesión.

### Listas CRUD (`*-list`)

- Tabla Material (`mat-table`), paginación, botones editar/eliminar, botón "Nuevo" que abre **`MatDialog`** con el `*-dialog` correspondiente.

### Diálogos (`*-dialog`)

- Formularios reactivos; envían al servicio **create** o **update** según el modo.

Patrón al **añadir una nueva entidad** del backend:

1. Añadir interfaces en **`models/api.models.ts`**.
2. Crear **`core/services/mi-entidad.service.ts`**.
3. Crear carpeta **`features/mi-entidad/`** con `mi-entidad-list` + `mi-entidad-dialog`.
4. Registrar ruta hija bajo **`/app`** en **`app.routes.ts`**.
5. Añadir entrada en el array **`nav`** de **`main-layout.ts`**.

---

## Servicios HTTP y modelos

- **`models/api.models.ts`**: interfaces TypeScript alineadas con los cuerpos y respuestas del FastAPI (UUID como `string`).
- **`core/services/*.service.ts`**: cada uno usa `HttpClient` y `environment.apiUrl`.

| Servicio | Entidad |
|----------|---------|
| `usuario.service.ts` | Usuarios |
| `propietario.service.ts` | Propietarios |
| `mascota.service.ts` | Mascotas |
| `cita.service.ts` | Citas |
| `vacuna.service.ts` | Vacunas |
| `factura.service.ts` | Facturas |

---

## Autenticación y usuario de auditoría

No hay JWT en esta versión: el "login" solo asocia un **usuario existente** del API y guarda su **`id_usuario`** en:

- **`AuditContextService`** → `localStorage` bajo la clave **`pos_audit_usuario_id`**.

Ese UUID se usa en los cuerpos que el backend exige para **trazabilidad** (`id_usuario_creacion`, `id_usuario_edita`, `id_usuario_agenda`, `id_usuario_registra`, `id_usuario_genera`, etc.).

---

## Integración con el backend (CORS)

El backend debe permitir el origen del frontend (por ejemplo `http://localhost:4200`). Si cambias el puerto del `ng serve`, añade ese origen en la configuración CORS del backend FastAPI.

---

## Problemas frecuentes

| Síntoma | Qué revisar |
|---------|-------------|
| **404** en `/mascotas` o similares | Que el backend use rutas de colección con **`/`** final y que el front llame a la misma convención. |
| **CORS error** en consola | Origen del front permitido en FastAPI; backend en marcha. |
| **`npm start` no existe** en la raíz | Ejecuta desde **`web/`** o usa el `package.json` de la raíz que delega a `web`. |
| **No carga datos** | `environment.apiUrl` correcto; API levantada en ese host/puerto. |
| **Login no encuentra el usuario** | El usuario debe existir en la base de datos; créalo primero desde el formulario de primer usuario. |

---

## Comandos útiles (referencia rápida)

| Acción | Comando (desde `web/`) |
|--------|------------------------|
| Instalar dependencias | `npm install` |
| Servidor desarrollo | `npm start` |
| Compilar producción | `npm run build` |
| Tests unitarios | `npm test` |
| CLI Angular | `npx ng generate component ...` |

---

## Objetivo académico

Este proyecto fue desarrollado con fines educativos como parte del curso de **Programación de Software** en el **Instituto Tecnológico Metropolitano (ITM)**. Aplica:

- Arquitectura de componentes standalone en Angular 20
- Consumo de API REST con `HttpClient` y `RxJS`
- Angular Material (tablas, formularios reactivos, diálogos, sidenav)
- Integración frontend-backend con FastAPI y PostgreSQL (Neon)
- Lazy loading, guards de ruta y gestión de estado con signals
