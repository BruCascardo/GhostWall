// Verifica que la aplicación web compilada se sirve y se presenta en español (RNF-015).
import { expect, test } from '@playwright/test';

test('la página de inicio carga, está en español y muestra el nombre del sistema', async ({
  page,
}) => {
  const respuesta = await page.goto('/');
  expect(respuesta?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page).toHaveTitle('GhostWall');
  await expect(page.getByRole('heading', { level: 1, name: 'GhostWall' })).toBeVisible();
});
