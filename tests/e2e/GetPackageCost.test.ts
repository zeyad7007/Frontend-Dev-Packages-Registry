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

describe('Get Package Cost Functionality', () => {
    let driver;

    beforeAll(async () => {
        driver = await getChromeDriver();
        await navigateToUrl(driver, 'http://localhost:5173/');
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

    test('Verify all components appear when "Get Package Cost" is clicked', async () => {
        // Click on the "Get Package Cost" button
        await clickElementByText(driver, 'Get Package Cost');


        const components = [
            { id: 'package-id-input' }, 
            { id: 'include-dependencies-checkbox' }, 
            { id: 'fetch-cost-button' } 
        ];

        // Verify that all components are displayed and scroll into view
        for (const component of components) {
            const element = await driver.wait(until.elementLocated(By.id(component.id)), 5000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", element);
            expect(await element.isDisplayed()).toBe(true);
        }
    });
});
