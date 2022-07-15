import { test, expect } from '@playwright/test';

test('update space member message', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}?mock=base`);

  await page.click('text=Login');

  await page.click('data-testid=YouTubeLoginButton');

  await page.click('text=✏️');

  await page.fill('#message', 'SingletonSean is the best.');

  await page.click('text=Update');

  const successMessage = await page.$(
    'text=We successfully updated your space member message.'
  );

  expect(successMessage).toBeTruthy();
});
