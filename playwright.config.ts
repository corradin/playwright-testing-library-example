import { PlaywrightTestConfig } from '@playwright/test';
import { devices } from 'playwright';
import dotenv from 'dotenv';

dotenv.config();

const config: PlaywrightTestConfig = {
  globalSetup: './global-setup',
  use: {
    trace: 'retain-on-failure',
    storageState: 'storage-state/storageState.json',
  },
  projects: [
    {
      name: 'Chrome Stable',
      use: {
        browserName: 'chromium',
        // Test against Chrome Stable channel.
        channel: 'chrome',
      },
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
