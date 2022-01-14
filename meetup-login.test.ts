import { test } from '@playwright/test';

test('Navigate to profile', async ({ page }) => {
    console.log(process.env.MEETUP_USERNAME);
    await page.goto('https://www.meetup.com/members/352885205/');
});
