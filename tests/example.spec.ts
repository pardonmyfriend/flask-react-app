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

test('test3', async () => {

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

  test('test4', async () => {

    test.setTimeout(60000);
    const browser = await chromium.launch({ headless: false }); // Ustawienie headless: false
    const page = await browser.newPage();
        // Uruchamiamy przeglądarkę w trybie widocznym (headless: false)
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
    
      // Zrobienie screenshotu przed jakąkolwiek interakcją
    await page.screenshot({ path: 'screenshots/homepage.png', fullPage: true });

      await page.getByRole('button', { name: 'Get started!' }).click();

      await page.screenshot({ path: 'screenshots/step1.png', fullPage: true });

      await page.locator('input[type="file"]').setInputFiles('Iris.csv');

      await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
      await page.screenshot({ path: 'screenshots/step2.png', fullPage: true });

      // await page.getByRole('tab', { name: 'Choose dataset' }).click();

      // await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
      // await page.screenshot({ path: 'screenshots/choose_dataset.png', fullPage: true });

      await page.getByRole('button').nth(3).click();

      await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
      await page.screenshot({ path: 'screenshots/step3.png', fullPage: true });

      await page.locator('div:nth-child(2) > button:nth-child(3)').click();

      await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
      await page.screenshot({ path: 'screenshots/step4.png', fullPage: true });

      await page.getByRole('checkbox').check();

      await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
      await page.screenshot({ path: 'screenshots/step5.png', fullPage: true });

      await page.getByRole('button', { name: 'Apply' }).click();

      await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
      await page.screenshot({ path: 'screenshots/step6.png', fullPage: true });

      await page.locator('div:nth-child(2) > button:nth-child(3)').click();

      await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
      await page.screenshot({ path: 'screenshots/step7.png', fullPage: true });

      await page.getByRole('tab', { name: 'Classification' }).click();

      await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
      await page.screenshot({ path: 'screenshots/step8.png', fullPage: true });

      await page.getByRole('button', { name: 'Decision Tree' }).click();

      await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
      await page.screenshot({ path: 'screenshots/step9.png', fullPage: true });

      await page.getByRole('button', { name: 'Save' }).click();

      await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
      await page.screenshot({ path: 'screenshots/step10.png', fullPage: true });

      await page.locator('div:nth-child(2) > button:nth-child(3)').click();

      await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
      await page.screenshot({ path: 'screenshots/step11.png', fullPage: true });

      await page.locator('div:nth-child(2) > button:nth-child(3)').click();
      await page.getByRole('button', { name: 'Dataset with Predictions' }).click();
      await page.getByRole('button', { name: 'PCA Scatter Plot of' }).click();
      await page.getByRole('button', { name: 'Class Distribution Bar Plot' }).click();
      await page.getByRole('button', { name: 'Decision Tree Visualization' }).click();
      await page.getByRole('button', { name: 'Feature Importance' }).click();
      await page.getByRole('button', { name: 'Performance Metrics' }).click();
      await page.getByRole('button', { name: 'Confusion Matrix' }).click();
      await page.getByRole('button', { name: 'Classification Report' }).click();

      // await page.locator('div:nth-child(6) > .MuiCollapse-root > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > .MuiAccordion-region > .MuiAccordionDetails-root > div > .js-plotly-plot > .plot-container > .user-select-none > svg > .draglayer > .xy > .nsewdrag').click();

      await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
      await page.screenshot({ path: 'screenshots/step13.png', fullPage: true });

    await browser.close();
    });

    test('test5', async () => {

      test.setTimeout(60000);
      const browser = await chromium.launch({ headless: false }); // Ustawienie headless: false
      const page = await browser.newPage();
          // Uruchamiamy przeglądarkę w trybie widocznym (headless: false)
      await page.goto('http://localhost:3000/');
      await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
      
        // Zrobienie screenshotu przed jakąkolwiek interakcją
      await page.screenshot({ path: 'screenshots/homepage.png', fullPage: true });
  
        await page.getByRole('button', { name: 'Get started!' }).click();
  
        await page.screenshot({ path: 'screenshots/step1.png', fullPage: true });
  
        await page.locator('input[type="file"]').setInputFiles('Iris.csv');
  
        await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
        await page.screenshot({ path: 'screenshots/step2.png', fullPage: true });
  
        await page.goto('http://localhost:3000/');
        await page.getByRole('button', { name: 'Get started!' }).click();
        await page.getByRole('tab', { name: 'Choose dataset' }).click();

        await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
        await page.screenshot({ path: 'screenshots/choose_dataset.png', fullPage: true });

        await page.getByRole('button', { name: 'Wine Dataset' }).click();
        await page.getByRole('button', { name: 'CONFIRM' }).click();

        await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
        await page.screenshot({ path: 'screenshots/dataset_chosen.png', fullPage: true });
        
        await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
        await page.screenshot({ path: 'screenshots/step12.png', fullPage: true });
      await browser.close();
      });

      test('test6', async () => {
        test.setTimeout(60000);
        const browser = await chromium.launch({ headless: false }); // Ustawienie headless: false
        const page = await browser.newPage();
            // Uruchamiamy przeglądarkę w trybie widocznym (headless: false)
        await page.goto('http://localhost:3000/');
        await page.waitForTimeout(2000);  // Opóźnienie o 2 sekundy
        
          // Zrobienie screenshotu przed jakąkolwiek interakcją
        await page.screenshot({ path: 'screenshots/homepage.png', fullPage: true });
    
          await page.getByRole('button', { name: 'Get started!' }).click();
    
          await page.screenshot({ path: 'screenshots/step1.png', fullPage: true });
    
          await page.locator('input[type="file"]').setInputFiles('Iris(1).csv');
    
          await page.getByRole('button').nth(3).click();
          await page.locator('div:nth-child(2) > button:nth-child(3)').click();
          await page.locator('#additional-select-3').click();
          await page.getByRole('option', { name: 'Fill with specific value' }).click();
          await page.locator('div').filter({ hasText: /^1Handle NullFill with specific valueHandle Null$/ }).getByRole('button').first().click();
          await page.getByLabel('Fill with specific value').click();
          await page.waitForTimeout(2000); 
          await page.screenshot({ path: 'screenshots/handle_null.png', fullPage: true });

        await browser.close();
        });

        test('ShouldPerformKMeansSuccessfully', async () => {
          const browser = await chromium.launch({ headless: false });
          const page = await browser.newPage();
          await page.goto('http://localhost:3000/');
          await page.getByRole('button', { name: 'Get started!' }).click();
          await page.getByRole('tab', { name: 'Choose dataset' }).click();
          await page.getByRole('button', { name: 'Iris Dataset' }).click();
          await page.getByRole('button', { name: 'CONFIRM' }).click();
          await page.locator('button:nth-child(3)').click();
          await page.locator('div:nth-child(2) > button:nth-child(3)').click();
          await page.locator('div:nth-child(2) > button:nth-child(3)').click();
          await page.getByRole('tab', { name: 'Cluster analysis' }).click();
          await page.getByRole('button', { name: 'K-Means' }).click();
          await page.getByRole('button', { name: 'Save' }).click();
          await page.locator('div:nth-child(2) > button:nth-child(3)').click();
          await browser.close();
          });

  test('ShouldPerformPCASuccessfully', async () => {
    const startTime = Date.now(); 
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: 'Get started!' }).click();
    await page.locator('input[type="file"]').setInputFiles('Iris.csv');
    await page.getByRole('button').nth(3).click();
    await page.locator('div:nth-child(2) > button:nth-child(3)').click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.locator('div:nth-child(2) > button:nth-child(3)').click();
    await page.getByRole('button', { name: 'PCA' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.locator('div:nth-child(2) > button:nth-child(3)').click();
    await browser.close();
    const endTime = Date.now(); 
    const duration = (endTime - startTime) / 1000; 
    console.log(`Test completed in ${duration.toFixed(2)} seconds.`);
    });

    test('ShouldPerformPCASuccessfully2', async () => {
      test.setTimeout(100000);
      const numOfRuns = 10; // liczba powtórzeń
      let totalDuration = 0;
    
      for (let i = 0; i < numOfRuns; i++) {
        const startTime = Date.now();
    
        const browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();
    
        // Wykonaj test
        await page.goto('http://localhost:3000/');
        await page.getByRole('button', { name: 'Get started!' }).click();
        await page.locator('input[type="file"]').setInputFiles('Iris.csv');
        await page.getByRole('button').nth(3).click();
        await page.locator('div:nth-child(2) > button:nth-child(3)').click();
        await page.getByRole('button', { name: 'Apply' }).click();
        await page.locator('div:nth-child(2) > button:nth-child(3)').click();
        await page.getByRole('button', { name: 'PCA' }).click();
        await page.getByRole('button', { name: 'Save' }).click();
        await page.locator('div:nth-child(2) > button:nth-child(3)').click();
    
        await browser.close();
    
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        totalDuration += duration; // dodaj czas trwania tego testu do sumy
        console.log(`Run ${i + 1} completed in ${duration.toFixed(2)} seconds.`);
      }
    
      const averageDuration = totalDuration / numOfRuns; // oblicz średni czas
      console.log(`Average test duration over ${numOfRuns} runs: ${averageDuration.toFixed(2)} seconds.`);
    });



    test('ShouldPerformtSNESuccessfully', async () => {
      const browser = await chromium.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto('http://localhost:3000/');
      await page.getByRole('button', { name: 'Get started!' }).click();
      await page.locator('input[type="file"]').setInputFiles('Iris.csv');
      await page.getByRole('button').nth(3).click();
      await page.locator('div:nth-child(2) > button:nth-child(3)').click();
      await page.getByRole('button', { name: 'Apply' }).click();
      await page.locator('div:nth-child(2) > button:nth-child(3)').click();
      await page.getByRole('button', { name: 't-SNE' }).click();
      await page.getByRole('button', { name: 'Save' }).click();
      await page.locator('div:nth-child(2) > button:nth-child(3)').click();
      await browser.close();
      });

      test.only('ShouldPerformtSNESuccessfully2', async () => {
        test.setTimeout(100000);
        const numOfRuns = 10; // liczba powtórzeń
        let totalDuration = 0;
      
        for (let i = 0; i < numOfRuns; i++) {
          const startTime = Date.now();
      
          const browser = await chromium.launch({ headless: false });
          const page = await browser.newPage();
          await page.goto('http://localhost:3000/');
          await page.getByRole('button', { name: 'Get started!' }).click();
          await page.locator('input[type="file"]').setInputFiles('Iris.csv');
          await page.getByRole('button').nth(3).click();
          await page.locator('div:nth-child(2) > button:nth-child(3)').click();
          await page.getByRole('button', { name: 'Apply' }).click();
          await page.locator('div:nth-child(2) > button:nth-child(3)').click();
          await page.getByRole('button', { name: 't-SNE' }).click();
          await page.getByRole('button', { name: 'Save' }).click();
          await page.locator('div:nth-child(2) > button:nth-child(3)').click();
          await browser.close();
      
          const endTime = Date.now();
          const duration = (endTime - startTime) / 1000;
          totalDuration += duration; // dodaj czas trwania tego testu do sumy
          console.log(`Run ${i + 1} completed in ${duration.toFixed(2)} seconds.`);
        }
      
        const averageDuration = totalDuration / numOfRuns; // oblicz średni czas
        console.log(`Average test duration over ${numOfRuns} runs: ${averageDuration.toFixed(2)} seconds.`);
      });
  

    

