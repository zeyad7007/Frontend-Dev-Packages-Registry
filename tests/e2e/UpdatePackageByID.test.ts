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
describe('Update Package by ID Functionality', () => {
    let driver;

    beforeAll(async () => {
        driver = await getChromeDriver();
        await navigateToUrl(driver, 'http://localhost:5173/home');
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

    test('Verify all components appear when "Update Package by ID" is clicked', async () => {
        // Click on the "Update Package by ID" button
        await clickElementByText(driver, 'Update Package by ID');

        // Verify and scroll to all components by ID
        const elements = [
            "package-id-input",       
            "package-name-input",      
            "package-version-input",  
            "debloat-checkbox",        
            "js-program-textarea",    
            "github-url-input",       
            "file-upload",             
            "update-package-button",   
        ];

        for (const id of elements) {
            const el = await driver.wait(until.elementLocated(By.id(id)), 5000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", el);
            expect(await el.isDisplayed()).toBe(true);
        }
    });
});
