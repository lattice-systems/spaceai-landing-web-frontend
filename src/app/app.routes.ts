import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/public/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'client',
    canActivate: [authGuard],
    data: { roles: ['Client'] },
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
        path: 'opiniones',
        loadComponent: () =>
          import('./features/portal/client-reviews/client-reviews').then((m) => m.ClientReviews),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/portal/client-profile/client-profile').then((m) => m.ClientProfile),
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: ['Admin'] },
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'usuarios',
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/admin/admin-users/admin-users').then((m) => m.AdminUsers),
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./features/admin/admin-products/admin-products').then((m) => m.AdminProducts),
      },
      {
        path: 'cotizaciones',
        loadComponent: () =>
          import('./features/admin/admin-quotes/admin-quotes').then((m) => m.AdminQuotes),
      },
      {
        path: 'mensajes',
        loadComponent: () =>
          import('./features/admin/admin-messages/admin-messages').then((m) => m.AdminMessages),
      },
      {
        path: 'materiales',
        loadComponent: () =>
          import('./features/admin/admin-materials/admin-materials').then((m) => m.AdminMaterials),
      },
      {
        path: 'recetas',
        loadComponent: () =>
          import('./features/admin/admin-recipes/admin-recipes').then((m) => m.AdminRecipes),
      },
      {
        path: 'resenas',
        loadComponent: () =>
          import('./features/admin/admin-reviews/admin-reviews').then((m) => m.AdminReviews),
      },
      {
        path: 'proveedores',
        loadComponent: () =>
          import('./features/admin/admin-providers/admin-providers').then(
            (m) => m.AdminProviders,
          ),
      },
      {
        path: 'compras',
        loadComponent: () =>
          import('./features/admin/admin-purchases/admin-purchases').then(
            (m) => m.AdminPurchases,
          ),
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
