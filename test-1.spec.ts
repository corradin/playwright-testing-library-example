import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

  // Go to https://www.meetup.com/apps/
  await page.goto('https://www.meetup.com/apps/');

  // Click [placeholder="Neighborhood or City or zip code"]
  await page.locator('[placeholder="Neighborhood or City or zip code"]').click();

});