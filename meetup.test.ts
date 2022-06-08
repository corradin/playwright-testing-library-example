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

// Fixture/parameterized test
testWithFixture(
  'should return search result based on location with fixtures',
  async ({ page, search, location }) => {
    for (const searchTerm of search) {
      await page.goto('https://www.meetup.com');
      await page.fill(`[placeholder='Search for "tennis"']`, searchTerm);
      await page.fill(
        `[placeholder="Neighborhood or City or zip code"]`,
        location,
      );
    }
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

// Network request/response monitoring
test('should wait for lang network response', async ({ page }) => {
  const [response] = await Promise.all([
    page.waitForResponse('**/en-US*.json'),
    await page.goto('https://www.meetup.com'),
  ]);
  const responseData = await response.json();
  expect(responseData['indexPage.searchIntro.twentyYearstitle']).toBe(
    'Celebrating 20 years of real connections on Meetup',
  );
});

// Network response handling (modification)
test('should return mocked lang response', async ({ page }) => {
  await page.route('**/en-US*.json', async (route) => {
    // Fetch original response.
    const response = await page.request.fetch(route.request());
    const responseData = await response.json();
    responseData['indexPage.searchIntro.twentyYearstitle'] = 'My new Intro';

    route.fulfill({
      response,
      body: JSON.stringify(responseData),
    });
  });
  await page.goto('https://www.meetup.com');

  const headerText = await page.locator('h1').textContent();
  expect(headerText).toBe('My new Intro');
});

// Network request/response monitoring GraphQL
test('should wait for gql network response', async ({ page }) => {
  const [request] = await Promise.all([
    page.waitForRequest(
      (request) =>
        request.url().includes('/gql') &&
        request.postData().includes('locationWithoutInput'),
    ),
    await page.goto('https://www.meetup.com/apps'),
  ]);
  const response = await request.response();
  const responseData = await response?.json();
  console.log(responseData);
  expect(responseData?.data?.userLocation?.length).toBeGreaterThan(0);
});

// Network response handling (modification) GraphQl
test('should return mocked gql response', async ({ context, page }) => {
  await context.addInitScript(() => delete window.navigator.serviceWorker);
  await page.route('**/gql', async (route) => {
    // Fetch original response.
    const request = await route.request();
    if (
      request.url().includes('/gql') &&
      request.postData().includes('locationWithoutInput')
    ) {
      const response = await page.request.post(route.request());
      const responseData = await response?.json();
      responseData.data.userLocation[0].city = 'Berlin';
      responseData.data.userLocation[0].country = 'Germany';
      route.fulfill({
        response,
        body: JSON.stringify(responseData),
      });
    } else {
      route.continue();
    }
  });
  await page.goto('https://www.meetup.com/apps', { waitUntil: 'networkidle' });

  await expect(page.locator('[data-event-label="Location search"]')).toHaveValue('Berlin, GERMANY');
});
