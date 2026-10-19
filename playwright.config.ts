import { loadEnvFile } from 'node:process';
import { resolve } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

try {
  loadEnvFile(resolve(__dirname, '.env'));
} catch (error) {
  if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') {
    throw error;
  }
}

const baseURL = process.env.BASE_URL ?? 'https://www.saucedemo.com';

try {
  const url = new URL(baseURL);
  if (!/^https?:\/\//i.test(baseURL) || !url.hostname) {
    throw new Error();
  }
} catch {
  throw new Error('BASE_URL must be a nonempty absolute HTTP or HTTPS URL.');
}

export default defineConfig({
  testDir: './tests',
  retries: 0,
  reporter: 'list',
  use: {
    baseURL,
    headless: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
