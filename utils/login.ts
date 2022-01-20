import { Page } from '@playwright/test';

async function login(
  page: Page,
  username: string,
  password: string,
): Promise<void> {
  const loginUrl = 'https://www.meetup.com/login';
  await page.goto(loginUrl);
  await page.fill('id=email', username);
  await page.fill('id=current-password', password);

  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type=submit] >> "Log in"'),
  ]);
}

export default login;
