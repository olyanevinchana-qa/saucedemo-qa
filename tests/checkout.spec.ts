import { test, expect } from '@playwright/test';
import { getValidLoginCredentials } from '../src/data/credentials';
import { customer } from '../src/data/customer';
import { backpackOrderTotals } from '../src/data/order-totals';
import { backpack } from '../src/data/products';
import { orderCompleteMessages, pageTitles } from '../src/data/page-text';
import { LoginPage } from '../src/pages/login.page';
import { InventoryPage } from '../src/pages/inventory.page';
import { CartPage } from '../src/pages/cart.page';
import { CheckoutPage } from '../src/pages/checkout.page';

test('checkout completes the order', async ({ page }) => {
  const credentials = getValidLoginCredentials();
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await login.goto();
  await login.login(credentials);
  await expect(inventory.title).toHaveText(pageTitles.inventory);
  await inventory.addToCart(backpack);
  await inventory.openCart();
  await expect(cart.title).toHaveText(pageTitles.cart);
  await cart.checkout();

  await expect(checkout.title).toHaveText(pageTitles.checkoutInformation);
  await checkout.fillInformation(customer);
  await checkout.continue();

  await expect(page).toHaveURL('/checkout-step-two.html');
  await expect(checkout.title).toHaveText(pageTitles.checkoutOverview);
  await expect(checkout.itemNames).toHaveText([backpack.name]);
  await expect(checkout.itemTotal).toHaveText(backpackOrderTotals.itemTotal);
  await expect(checkout.tax).toHaveText(backpackOrderTotals.tax);
  await expect(checkout.total).toHaveText(backpackOrderTotals.total);
  await checkout.finish();

  await expect(page).toHaveURL('/checkout-complete.html');
  await expect(checkout.title).toHaveText(pageTitles.checkoutComplete);
  await expect(checkout.completeHeader).toHaveText(orderCompleteMessages.header);
  await expect(checkout.completeText).toHaveText(orderCompleteMessages.text);
  await expect(inventory.cartBadge).toHaveCount(0);
});
