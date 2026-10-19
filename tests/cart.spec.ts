import { test, expect } from '@playwright/test';
import { getValidLoginCredentials } from '../src/data/credentials';
import { backpack } from '../src/data/products';
import { LoginPage } from '../src/pages/login.page';
import { InventoryPage } from '../src/pages/inventory.page';
import { CartPage } from '../src/pages/cart.page';

test('added product appears in the cart', async ({ page, baseURL }) => {
  const credentials = getValidLoginCredentials();
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const expectedOrigin = new URL(baseURL!).origin;

  await login.goto();
  await login.login(credentials);
  await expect(inventory.title).toHaveText('Products');

  await inventory.addToCart(backpack);
  await expect(inventory.cartBadge).toHaveText('1');
  await expect(inventory.removeButton(backpack)).toBeVisible();

  await inventory.openCart();
  await expect(page).toHaveURL(url =>
    url.origin === expectedOrigin && url.pathname === '/cart.html',
  );
  await expect(cart.title).toHaveText('Your Cart');
  await expect(cart.items).toHaveCount(1);

  const item = cart.items.first();
  await expect(cart.itemName(item)).toHaveText(backpack.name);
  await expect(cart.itemPrice(item)).toHaveText(backpack.price);
  await expect(cart.itemQuantity(item)).toHaveText('1');
  await expect(cart.itemDescription(item)).toHaveText(backpack.description);
});
