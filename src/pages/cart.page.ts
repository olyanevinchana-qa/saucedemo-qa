import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly title: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.items = page.locator('[data-test="inventory-item"]');
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
}
