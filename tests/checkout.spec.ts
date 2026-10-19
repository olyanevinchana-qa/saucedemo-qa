import { test, expect } from '@playwright/test';
import { getValidLoginCredentials } from '../src/data/credentials';
import { customer } from '../src/data/customer';
import { backpackOrderTotals } from '../src/data/order-totals';
import { backpack } from '../src/data/products';
import { LoginPage } from '../src/pages/login.page';
import { InventoryPage } from '../src/pages/inventory.page';
import { CartPage } from '../src/pages/cart.page';
import { CheckoutPage } from '../src/pages/checkout.page';

test('QA-003: checkout completes the order', async ({ page, baseURL }) => {
  const credentials = getValidLoginCredentials();
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  const expectedOrigin = new URL(baseURL!).origin;

  await login.goto();
  await login.login(credentials);
  await expect(inventory.title).toHaveText('Products');
  await inventory.addToCart(backpack);
  await inventory.openCart();
  await expect(cart.title).toHaveText('Your Cart');
  await cart.checkout();

  await expect(checkout.title).toHaveText('Checkout: Your Information');
  await checkout.fillInformation(customer);
  await checkout.continue();

  await expect(page).toHaveURL(url =>
    url.origin === expectedOrigin && url.pathname === '/checkout-step-two.html',
  );
  await expect(checkout.title).toHaveText('Checkout: Overview');
  await expect(checkout.itemNames).toHaveText([backpack.name]);
  await expect(checkout.itemTotal).toHaveText(backpackOrderTotals.itemTotal);
  await expect(checkout.tax).toHaveText(backpackOrderTotals.tax);
  await expect(checkout.total).toHaveText(backpackOrderTotals.total);
  await checkout.finish();

  await expect(page).toHaveURL(url =>
    url.origin === expectedOrigin && url.pathname === '/checkout-complete.html',
  );
  await expect(checkout.title).toHaveText('Checkout: Complete!');
  await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
  await expect(checkout.completeText).toHaveText(
    'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
  );
  await expect(checkout.cartBadge).toHaveCount(0);
});
