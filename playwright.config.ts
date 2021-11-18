import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  use: {
    trace: 'retain-on-failure',
  },
};
export default config;
