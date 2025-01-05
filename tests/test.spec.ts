import { test, expect, chromium, firefox, webkit } from '@playwright/test';

const browsers = [
  { name: 'Chromium', instance: chromium },
  { name: 'Firefox', instance: firefox },
  { name: 'WebKit', instance: webkit },
];

browsers.forEach(({ name, instance }) => {
  test(`Test execution time in ${name}`, async () => {
    const startTime = Date.now(); 

    const browser = await instance.launch({ headless: false });
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
    const PCAScatterPlotForClustersAccordion = page.getByRole('button', { name: 'PCA Scatter Plot of Clusters' });
    const PCAscatterPlotForClusters = page.locator('div:nth-child(4) > .MuiCollapse-root > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > .MuiAccordion-region > .MuiAccordionDetails-root');
    await expect(PCAScatterPlotForClustersAccordion).toBeVisible();
    await expect(PCAscatterPlotForClusters).toBeVisible();
    await page.screenshot({ path: 'screenshots/KMeansResults.png', fullPage: true });
    await browser.close();

    const endTime = Date.now(); 
    const duration = (endTime - startTime) / 1000; 
    console.log(`Test in ${name} completed in ${duration.toFixed(2)} seconds.`);
  });
});

test(`ShouldPerformKMeansSuccessfully`, async () => {
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
  const PCAScatterPlotForClustersAccordion = page.getByRole('button', { name: 'PCA Scatter Plot of Clusters' });
  const PCAscatterPlotForClusters = page.locator('div:nth-child(4) > .MuiCollapse-root > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > .MuiAccordion-region > .MuiAccordionDetails-root');
  
  await expect(PCAScatterPlotForClustersAccordion).toBeVisible(); 
  await expect(PCAscatterPlotForClusters).toBeVisible(); 
  await page.screenshot({ path: 'screenshots/KMeansResults.png', fullPage: true }); 

  await browser.close(); 
});