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