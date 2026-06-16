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

test('continues from a prepared save and reaches THE END', async ({ page }) => {
  const preparedPlayer = {
    name: 'アレン',
    level: 6,
    exp: 0,
    nextExp: 70,
    hp: 62,
    maxHp: 62,
    mp: 16,
    maxMp: 16,
    attack: 20,
    defense: 8,
    gold: 120,
    herbs: 5,
    mapId: 'final',
    x: 10,
    y: 2,
    direction: 'up',
    flags: {
      acceptedQuest: true,
      seenInitialHint: true,
      gotMoonKey: true,
      openedMoonChest: true,
      openedTowerDoor: true,
      gotBlueOrb: true,
      openedTowerChest: true,
      gotDawnMark: true,
      openedShrineDoor: true,
      gotTideMirror: true,
      openedShrineChest: true,
      openedFinalPath: true,
      defeatedFinalBoss: false,
      clearedGame: false
    }
  };

  await page.addInitScript((player) => {
    localStorage.setItem('dorakue1.save.v1', JSON.stringify({
      version: 1,
      savedAt: new Date().toISOString(),
      player
    }));
  }, preparedPlayer);

  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect.poll(async () => {
    return page.evaluate(() => localStorage.getItem('dorakue1.save.v1') !== null);
  }).toBe(true);
  await expect.poll(async () => {
    return page.evaluate(() => window.__dorakueTitleDebug?.hasSave ?? false);
  }).toBe(true);
  await page.keyboard.press('ArrowDown');
  await expect.poll(async () => {
    return page.evaluate(() => window.__dorakueTitleDebug?.selectedAction ?? '');
  }).toBe('continue');
  await page.keyboard.press('Enter');

  await expect.poll(async () => {
    return page.evaluate(() => window.__dorakueDebug?.mapId ?? '');
  }).toBe('final');

  await page.keyboard.press('Enter');
  await expect.poll(async () => {
    return page.evaluate(() => window.__dorakueDebug?.dialog?.speaker ?? '');
  }).toBe('黒鐘の王');

  for (let index = 0; index < 40; index += 1) {
    let debugState = await page.evaluate(() => window.__dorakueDebug);
    if (debugState?.dialog?.line === 'THE END') break;
    await page.keyboard.press('Enter');
    await page.waitForTimeout(30);
    debugState = await page.evaluate(() => window.__dorakueDebug);
    if (debugState?.dialog?.line === 'THE END') break;
  }

  await expect.poll(async () => {
    return page.evaluate(() => window.__dorakueDebug?.dialog?.line ?? '');
  }).toBe('THE END');

  const debugState = await page.evaluate(() => window.__dorakueDebug);
  expect(debugState.flags).toMatchObject({
    defeatedFinalBoss: true,
    clearedGame: true
  });
});
