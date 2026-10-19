import type { Locator, Page } from '@playwright/test';
import type { Product } from '../data/products';
import { pageTitle } from './page-title';

export class InventoryPage {
  readonly title: Locator;
  readonly products: Locator;
  readonly cartBadge: Locator;
  private readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.title = pageTitle(page);
    this.products = page.locator('[data-test="inventory-item"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  private card(product: Product): Locator {
    return this.products.filter({
      has: this.page.getByText(product.name, { exact: true }),
    });
  }

  removeButton(product: Product): Locator {
    return this.card(product).getByRole('button', { name: 'Remove', exact: true });
  }

  async addToCart(product: Product): Promise<void> {
    await this.card(product).getByRole('button', { name: 'Add to cart', exact: true }).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
