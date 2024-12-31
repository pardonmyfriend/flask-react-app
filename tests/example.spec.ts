import { test, expect, chromium } from '@playwright/test';

test('test1', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Browse file' }).click();
  await page.getByRole('button', { name: 'Browse file' }).setInputFiles('Iris.csv');
  await page.getByRole('button').nth(3).click();
  await page.locator('div:nth-child(2) > button:nth-child(3)').click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.getByRole('button', { name: 'Normalize' }).click();
  await page.getByRole('tab', { name: 'Summary' }).click();
});

test('test2', async () => {

const browser = await chromium.launch({ headless: false }); // Ustawienie headless: false
const page = await browser.newPage();
    // Uruchamiamy przeglądarkę w trybie widocznym (headless: false)
await page.goto('http://localhost:3000/');
await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy

  // Zrobienie screenshotu przed jakąkolwiek interakcją
await page.screenshot({ path: 'screenshots/step1.png', fullPage: true });

  // Interakcja z input[type="file"]
await page.locator('input[type="file"]').setInputFiles('Iris.csv');
await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy

  // Zrobienie screenshotu po kliknięciu
await page.screenshot({ path: 'screenshots/step2.png', fullPage: true });

  // (Opcjonalnie możesz dodać inne kroki i screenshoty, zależnie od tego, jak chcesz testować)
await browser.close();
});

test.only('test3', async () => {

  const browser = await chromium.launch({ headless: false }); // Ustawienie headless: false
  const page = await browser.newPage();
      // Uruchamiamy przeglądarkę w trybie widocznym (headless: false)
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
  
    // Zrobienie screenshotu przed jakąkolwiek interakcją
  await page.screenshot({ path: 'screenshots/step1.png', fullPage: true });
  
    // Interakcja z input[type="file"]
  await page.locator('input[type="file"]').setInputFiles('Iris.csv');
  await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
  
  await page.getByRole('button').nth(3).click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/step3.png', fullPage: true });
  await page.locator('div:nth-child(2) > button:nth-child(3)').click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/step4.png', fullPage: true });
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/step5.png', fullPage: true });
  await page.getByRole('tab', { name: 'Summary' }).click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/step6.png', fullPage: true });
  await page.locator('div:nth-child(2) > button:nth-child(3)').click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/step7.png', fullPage: true });

    // (Opcjonalnie możesz dodać inne kroki i screenshoty, zależnie od tego, jak chcesz testować)
  await browser.close();
  });