import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/home/home').then((m) => m.Home),
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./features/public/contacto/contacto').then((m) => m.Contacto),
      },
      {
        path: 'cotizador',
        loadComponent: () =>
          import('./features/public/cotizador/cotizador').then((m) => m.Cotizador),
      },
    ],
  },
];
