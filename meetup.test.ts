import { test, expect } from '@playwright/test';
import testWithFixture from './searchData';

test.use({
  headless: false,
  launchOptions: { slowMo: 0 },
  viewport: { width: 1920, height: 1080 },
  storageState: undefined,
});

// Parallel testing
test.describe.configure({ mode: 'parallel' });

// A page property
test('should contain homepage title', async ({ page }) => {
  await page.goto('https://www.meetup.com');
  const title = await page.title();
  expect(title).toBe('Meetup - We are what we do');
});

// The first Selector
test('should contain header text', async ({ page }) => {
  await page.goto('https://www.meetup.com');
  const headerText = await page.locator('h1').textContent();
  expect(headerText).toBe('Celebrating 20 years of real connections on Meetup');
});

// Selector chaining and debugging.
test('should return search result based on location', async ({ page }) => {
  await page.goto('https://www.meetup.com');
  // Only needed for firefox
  await page.mouse.wheel(0, 200);
  await page.fill(`[placeholder='Search for "tennis"']`, 'cypress');
  await page.fill(
    `[placeholder="Neighborhood or City or zip code"]`,
    'Hilversum, NL',
  );
  await page.click('text="Hilversum, Netherlands"');

  await Promise.all([page.waitForNavigation(), page.click('[value="Search"]')]);

  const firstResultTitleElement = await page.locator(
    '.max-w-narrow >> :nth-match(div, 1) >> p:has-text("Playwright Vs. Cypress")',
  );
  const title = await firstResultTitleElement.textContent();
  expect(title).toBe('Playwright Vs. Cypress - The Sequel');
});

// Fixture
testWithFixture(
  'should return search result based on location with fixtures',
  async ({ page, search, location }) => {
    await page.goto('https://www.meetup.com');
    await page.fill(`[placeholder='Search for "tennis"']`, search);
    await page.fill(
      `[placeholder="Neighborhood or City or zip code"]`,
      location,
    );
  },
);

// Auto-wait Waiting for spinners (network request), set slowMo to 0
test('should return search result based on location with auto wait', async ({
  page,
}) => {
  await page.goto('https://www.meetup.com');
  // Only needed for firefox
  await page.mouse.wheel(0, 200);

  await page.fill(`[placeholder='Search for "tennis"']`, 'cypress');
  await page.fill(
    `[placeholder="Neighborhood or City or zip code"]`,
    'Hilversum, NL',
  );
  // When you have a spinner for a network request
  // const response = await page.waitForResponse('https://www.meetup.com/gql');
  // const responseData = await response.json();
  // expect(responseData.data.searchedLocations[0].name_string).toBe(
  //   'Hilversum, Netherlands',
  // );

  await page.click(
    '[data-testid="SearchTypeahead"] div:has-text("Hilversum, Netherlands")',
  );

  // Always try to test from a user perspective
  // await page.click('text="Hilversum, Netherlands"');

  await Promise.all([page.waitForNavigation(), page.click('[value="Search"]')]);

  const firstResultTitleElement = await page.locator(
    '.max-w-narrow >> :nth-match(div, 1) >> p:has-text("Playwright Vs. Cypress")',
  );
  const title = await firstResultTitleElement.textContent();
  expect(title).toBe('Playwright Vs. Cypress - The Sequel');
});

// Snapshot testing
test('should match search screenshot', async ({ page }) => {
  await page.goto('https://www.meetup.com');
  // Only needed for firefox
  await page.mouse.wheel(0, 200);

  await page.fill(`[placeholder='Search for "tennis"']`, 'cypress');
  await page.fill(
    `[placeholder="Neighborhood or City or zip code"]`,
    'Hilversum, NL',
  );

  // await page.screenshot({ path: 'search.png' });

  await expect(page).toHaveScreenshot();
});
