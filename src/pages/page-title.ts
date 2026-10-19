import type { Locator, Page } from '@playwright/test';

export function pageTitle(page: Page): Locator {
  return page.locator('[data-test="title"]');
}
