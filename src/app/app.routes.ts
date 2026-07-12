import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/public/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'client',
    loadComponent: () =>
      import('./layouts/portal-layout/portal-layout').then((m) => m.PortalLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/portal/client-dashboard/client-dashboard').then(
            (m) => m.ClientDashboard,
          ),
      },
      {
        path: 'documentos',
        data: { section: 'documentos' },
        loadComponent: () =>
          import('./features/portal/client-section/client-section').then((m) => m.ClientSection),
      },
      {
        path: 'cotizaciones',
        data: { section: 'cotizaciones' },
        loadComponent: () =>
          import('./features/portal/client-section/client-section').then((m) => m.ClientSection),
      },
      {
        path: 'soporte',
        data: { section: 'soporte' },
        loadComponent: () =>
          import('./features/portal/client-section/client-section').then((m) => m.ClientSection),
      },
      {
        path: 'perfil',
        data: { section: 'perfil' },
        loadComponent: () =>
          import('./features/portal/client-section/client-section').then((m) => m.ClientSection),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/public/home/home').then((m) => m.Home),
      },
      {
        path: 'contacto',
        loadComponent: () => import('./features/public/contacto/contacto').then((m) => m.Contacto),
      },
      {
        path: 'cotizador',
        loadComponent: () =>
          import('./features/public/cotizador/cotizador').then((m) => m.Cotizador),
      },
      {
        path: 'nosotros',
        loadComponent: () => import('./features/public/nosotros/nosotros').then((m) => m.Nosotros),
      },
      {
        path: 'spaceai',
        loadComponent: () => import('./features/public/spaceia/spaceia').then((m) => m.Spaceia),
      },
      {
        path: 'casos-de-uso',
        loadComponent: () =>
          import('./features/public/casos-de-uso/casos-de-uso').then((m) => m.CasosDeUso),
      },
      {
        path: 'faq',
        loadComponent: () => import('./features/public/faq/faq').then((m) => m.Faq),
      },
      {
        path: 'privacidad',
        loadComponent: () => import('./features/public/legal/privacidad').then((m) => m.Privacidad),
      },
      {
        path: 'terminos',
        loadComponent: () => import('./features/public/legal/terminos').then((m) => m.Terminos),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./features/public/not-found/not-found').then((m) => m.NotFound),
      },
    ],
  },
];
