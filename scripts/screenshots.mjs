// Captura screenshots de la web-frontend del ecosistema (space-ai-web-frontend)
// para el showcase de device frames en /spaceia.
//
// Uso:
//   node scripts/screenshots.mjs
//   SHOTS_BASE=http://localhost:4200 node scripts/screenshots.mjs
//
// Base por defecto: web desplegada en Azure. Con SHOTS_BASE apuntas a local.
// Las credenciales de admin son las de DEMO (públicas), no secretos reales.

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const BASE = process.env.SHOTS_BASE ?? 'https://app.spaceai.latticesystems.dev';
const DEMO_EMAIL = process.env.SHOTS_EMAIL ?? 'admin@spaceia.com';
const DEMO_PASSWORD = process.env.SHOTS_PASSWORD ?? 'Admin123!';

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'screenshots');

async function shot(page, name) {
  const path = resolve(OUT, `${name}.png`);
  await page.screenshot({ path });
  console.log(`  ✓ ${name}.png`);
}

async function safe(label, fn) {
  try {
    await fn();
  } catch (err) {
    console.warn(`  ✗ ${label}: ${err.message}`);
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  console.log(`Base: ${BASE}`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ deviceScaleFactor: 2 });
  const page = await context.newPage();

  // 1. SIDE = raíz "/" (OnsiteComponent, kiosco). Viewport laptop.
  await safe('side', async () => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 45000 });
    await shot(page, 'side');
  });

  // 2. Vistas tablet. Viewport tablet landscape.
  await safe('access', async () => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto(`${BASE}/tablet/access`, { waitUntil: 'networkidle', timeout: 45000 });
    await shot(page, 'access');
  });
  await safe('cart', async () => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto(`${BASE}/tablet/cart`, { waitUntil: 'networkidle', timeout: 45000 });
    await shot(page, 'cart');
  });

  // 3. Admin: login con creds demo, capturar dashboard. Viewport laptop.
  await safe('admin', async () => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 45000 });
    await page.fill('input[type="email"], input[name="email"]', DEMO_EMAIL);
    await page.fill('input[type="password"], input[name="password"]', DEMO_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/**', { timeout: 45000 });
    await page.waitForLoadState('networkidle');
    await shot(page, 'admin');
  });

  await browser.close();
  console.log('Listo.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
