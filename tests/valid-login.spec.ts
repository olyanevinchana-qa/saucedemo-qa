import { test, expect } from '@playwright/test';
import { getValidLoginCredentials } from '../src/data/credentials';
import { pageTitles } from '../src/data/page-text';
import { LoginPage } from '../src/pages/login.page';
import { InventoryPage } from '../src/pages/inventory.page';

test('valid login displays the inventory', async ({ page }) => {
  const credentials = getValidLoginCredentials();
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);

  await login.goto();
  await login.login(credentials);

  await expect(page).toHaveURL('/inventory.html');
  await expect(inventory.title).toBeVisible();
  await expect(inventory.title).toHaveText(pageTitles.inventory);
  await expect(inventory.products.first()).toBeVisible();
});
