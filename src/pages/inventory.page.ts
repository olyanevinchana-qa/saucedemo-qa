import type { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly products: Locator;

  constructor(page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.products = page.locator('[data-test="inventory-item"]');
  }
}
