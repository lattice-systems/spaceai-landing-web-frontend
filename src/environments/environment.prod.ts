export const environment = {
  production: true,
  // Azure Static Web Apps no puede proxyear /api a un dominio externo (Fly.io)
  // como sí hacía el rewrite de Vercel — se llama directo, con CORS habilitado
  // en el backend para el dominio del frontend.
  apiUrl: 'https://spaceai-landing-api.fly.dev/api',
};
