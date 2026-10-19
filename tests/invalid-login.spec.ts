import { test, expect } from '@playwright/test';
import {
  invalidLoginCredentials,
  invalidLoginErrorMessage,
} from '../src/data/invalid-credentials';
import { LoginPage } from '../src/pages/login.page';
import { InventoryPage } from '../src/pages/inventory.page';

test('invalid login displays the error message', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);

  await login.goto();
  await login.login(invalidLoginCredentials);

  await expect(login.errorMessage).toBeVisible();
  await expect(login.errorMessage).toHaveText(invalidLoginErrorMessage);
  await expect(page).toHaveURL('/');
  await expect(inventory.title).toBeHidden();
  await expect(inventory.products).toHaveCount(0);
});
