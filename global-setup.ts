import { chromium } from '@playwright/test';
import login from './utils/login';

const username = process.env.MEETUP_USERNAME ?? '';
const password = process.env.MEETUP_PASSWORD ?? '';

async function globalSetup(config: FullConfig): Promise<void> {
  const { storageState } = config.projects[0].use;
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await login(page, username, password);
  await page.context().storageState({
    path: storageState,
  });
  await browser.close();
}

export default globalSetup;
