import { test, expect } from '@playwright/test';
import { getValidLoginCredentials } from '../src/data/credentials';
import { LoginPage } from '../src/pages/login.page';
import { InventoryPage } from '../src/pages/inventory.page';

test('valid login displays the inventory', async ({ page, baseURL }) => {
  const credentials = getValidLoginCredentials();
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const expectedOrigin = new URL(baseURL!).origin;

  await login.goto();
  await login.login(credentials);

  await expect(page).toHaveURL(url =>
    url.origin === expectedOrigin && url.pathname === '/inventory.html',
  );
  await expect(inventory.title).toBeVisible();
  await expect(inventory.title).toHaveText('Products');
  await expect(inventory.products.first()).toBeVisible();
});
