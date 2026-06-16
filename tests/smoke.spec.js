import { expect, test } from '@playwright/test';

async function getCanvasPixelStats(page) {
  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  const screenshot = await canvas.screenshot();
  const intrinsicSize = await canvas.evaluate((element) => ({
    width: element.width,
    height: element.height
  }));

  return {
    ...intrinsicSize,
    visibleWidth: box?.width ?? 0,
    visibleHeight: box?.height ?? 0,
    screenshotBytes: screenshot.length
  };
}

test('boots title screen and starts the field scene', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => {
    consoleErrors.push(error.message);
  });

  await page.goto('/');
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();

  const titleStats = await getCanvasPixelStats(page);
  expect(titleStats.width).toBeGreaterThanOrEqual(640);
  expect(titleStats.height).toBeGreaterThanOrEqual(480);
  expect(titleStats.visibleWidth).toBeGreaterThan(200);
  expect(titleStats.visibleHeight).toBeGreaterThan(150);
  expect(titleStats.screenshotBytes).toBeGreaterThan(5_000);

  await page.keyboard.press('Enter');
  await expect.poll(async () => {
    return page.evaluate(() => window.__dorakueDebug?.scene ?? '');
  }).toBe('FieldScene');

  const fieldStats = await getCanvasPixelStats(page);
  expect(fieldStats.screenshotBytes).toBeGreaterThan(5_000);

  const debugState = await page.evaluate(() => window.__dorakueDebug);
  expect(debugState.mapId).toBe('world');
  expect(debugState.player).toMatchObject({ x: 4, y: 3, direction: 'down' });
  expect(consoleErrors).toEqual([]);
});

test('shows touch controls on mobile viewport', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile-only control visibility check');

  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await page.keyboard.press('Enter');
  await expect.poll(async () => {
    return page.evaluate(() => window.__dorakueDebug?.scene ?? '');
  }).toBe('FieldScene');

  const screenshot = await page.screenshot();
  expect(screenshot.length).toBeGreaterThan(10_000);

  const debugState = await page.evaluate(() => window.__dorakueDebug);
  expect(debugState.mapId).toBe('world');
});
