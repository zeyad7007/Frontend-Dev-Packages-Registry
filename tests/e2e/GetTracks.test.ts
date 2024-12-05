import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { getChromeDriver } from './SeleniumSetup';
import { clickElementByText, navigateToUrl } from './NavigationHelper';
import { By, until } from 'selenium-webdriver';
import fs from 'fs';


declare global {
    interface Window {
      __coverage__: unknown;
    }
  }
describe('Get Tracks Functionality', () => {
    let driver;

    beforeAll(async () => {
        driver = await getChromeDriver();
        await navigateToUrl(driver, 'https://frontend-dev-packages-registry.vercel.app/tracks');
        
    });

    afterAll(async () => {
        // Fetch coverage from the browser and save it
        const coverage = await driver.executeScript(() => {
            return window.__coverage__;
        });

        if (coverage) {
            fs.writeFileSync('./.nyc_output/coverage-final.json', JSON.stringify(coverage));
        }

        await driver.quit();
    });

    test('Verify components on "Get Tracks" page', async () => {
        // Click on the "Get Tracks" button
        await clickElementByText(driver, 'Get Tracks');

        // Verify the "Planned Tracks" heading is displayed
        const plannedTracksHeading = await driver.wait(
            until.elementLocated(By.xpath("//h2[contains(text(), 'Planned Tracks')]")),
            5000
        );
        expect(await plannedTracksHeading.isDisplayed()).toBe(true);

        // Verify the "Access control track" item appears under the heading
        const accessControlTrack = await driver.wait(
            until.elementLocated(By.xpath("//li[contains(text(), 'Access control track')]")),
            5000
        );
        expect(await accessControlTrack.isDisplayed()).toBe(true);
    });
});
