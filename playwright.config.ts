import { PlaywrightTestConfig } from '@playwright/test';
import { devices } from 'playwright';
import dotenv from 'dotenv';

dotenv.config();

export const storageStatePath = 'storage-state/storageState.json';

const config: PlaywrightTestConfig = {
  // globalSetup: './global-setup',
  use: {
    trace: 'retain-on-failure',
    // storageState: storageStatePath,
    headless: false,
  },
  projects: [
    {
      name: 'setup',
      testMatch: 'login.setup.ts',
    },
    {
      name: 'Chrome',
      use: {
        browserName: 'chromium',
        storageState: storageStatePath,
      },
      dependencies: ['setup'],
    },
    {
      name: 'Desktop Safari',
      use: {
        browserName: 'webkit',
        viewport: { width: 1200, height: 750 },
      },
    },
    // Test against mobile viewports.
    {
      name: 'Mobile Chrome',
      use: devices['Pixel 5'],
    },
    {
      name: 'Mobile Safari',
      use: devices['iPhone 12'],
    },
    {
      name: 'Desktop Firefox',
      use: {
        browserName: 'firefox',
        viewport: { width: 800, height: 600 },
      },
    },
  ],
};
export default config;
