import type { Locator, Page } from '@playwright/test';
import { pageTitle } from './page-title';

export class CartPage {
  readonly title: Locator;
  readonly items: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.title = pageTitle(page);
    this.items = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  itemName(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-name"]');
  }

  itemPrice(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-price"]');
  }

  itemDescription(item: Locator): Locator {
    return item.locator('[data-test="inventory-item-desc"]');
  }

  itemQuantity(item: Locator): Locator {
    return item.locator('[data-test="item-quantity"]');
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
