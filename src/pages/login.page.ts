import type { Locator, Page } from '@playwright/test';
import type { LoginCredentials } from '../data/credentials';

export class LoginPage {
  private readonly username: Locator;
  private readonly password: Locator;
  private readonly submit: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.username = page.getByPlaceholder('Username', { exact: true });
    this.password = page.getByPlaceholder('Password', { exact: true });
    this.submit = page.getByRole('button', { name: 'Login', exact: true });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.username.fill(credentials.username);
    await this.password.fill(credentials.password);
    await this.submit.click();
  }
}
