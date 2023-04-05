import { chromium } from '@playwright/test';
import login from './utils/login';

const username = process.env.MEETUP_USERNAME ?? '';
const password = process.env.MEETUP_PASSWORD ?? '';
const runGlobalSetup = process.env.RUN_GLOBAL_SETUP ?? '';


async function globalSetup(config: FullConfig): Promise<void> {
  if(runGlobalSetup === 'true') {
    const { storageState } = config.projects[0].use;
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await login(page, username, password);
    await page.context().storageState({
      path: storageState,
    });
    await browser.close();
  }
}

export default globalSetup;
