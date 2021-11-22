# Getting started

Installing the testing library:

`$ npm i -D @playwright/test`

Installing the browsers:

`$ npm i -D playwright`

Working with typescript:

`$ npm i -D typescript ts-node`

# Creating your first test

See the file `meetup.test.ts`

# Different browsers

Create a playwright.config.ts file

# Debugging

## With Playwright Inspector

`$ PWDEBUG=1 npm run test`

In your testscript you can write `await page.pause();` where you want your
breakpoint.

Alternatively open inspector by: `$ npx playwright codegen [targetURL]`

## With trace viewer

The easiest way is to create a playwright.config.ts file and add the trace configuration in there.

After a test has failed, run: 

`$ npx playwright show-trace trace.zip`

# Cross browser

Once a playwright config file is in place, it is even easier to add browsers, by using projects.

```typescript
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
      }
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
      }
    },
  ],
```

## HTML Reporter
To view the test results in HTML do the following:

`$ npx playwright test --reporter=html`
