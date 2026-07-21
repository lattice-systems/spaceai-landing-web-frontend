# SpaceIA — Landing / plataforma comercial (Angular)

Frontend Angular 22 (standalone components) de la plataforma comercial/admin de Lattice Systems para SpaceIA — sitio público, portal de clientes y panel de administrador en una sola app. Backend real en `../spaceai-landing-api-core` (ASP.NET Core).

Ver `CLAUDE.md` para arquitectura, design system y convenciones. Ver `../docs/landing/PENDIENTES.md` para el checklist de la rúbrica y el estado de pendientes.

## Levantar en local

```bash
npm install
ng serve
```

Requiere el backend real corriendo en `http://localhost:5134` (ver README de `spaceai-landing-api-core`) — `src/environments/environment.ts` apunta ahí, no al `mock/mock-server.js` de json-server que existía en etapas tempranas del proyecto.

Abrir `http://localhost:4200/`.

### Usuarios de prueba

| Rol | Email | Password |
|---|---|---|
| Admin | `admin@spaceia.com` | `Admin123!` |
| Client | `cliente@spaceia.com` | `Cliente123!` |

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
