import { Page } from '@playwright/test';

async function login(
  page: Page,
  username: string,
  password: string,
): Promise<void> {
  await page.goto('https://www.meetup.com/login');
  await page.locator('id=email').fill(username);
  await page.locator('id=current-password').fill(password);

  await Promise.all([
    page.waitForNavigation(),
    page.locator('button[type=submit] >> "Log in"').click(),
  ]);
}

export default login;
