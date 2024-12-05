import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { getChromeDriver } from './SeleniumSetup';
import { clickElementByText, fillInputField, navigateToUrl } from './NavigationHelper';
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
        await navigateToUrl(driver, 'https://frontend-dev-packages-registry.vercel.app/home');
        // Perform login
        const usernameInput = await driver.findElement(By.id('username-input')); 
        const passwordInput = await driver.findElement(By.id('password-input')); 
        const loginButton = await driver.findElement(By.id('authenticate-button')); 

        await driver.executeScript('arguments[0].scrollIntoView(true);', usernameInput);
        await fillInputField(driver, By.id('username-input'), 'adminUser'); 
        await driver.executeScript('arguments[0].scrollIntoView(true);', passwordInput);
        await fillInputField(driver, By.id('password-input'), 'adminPassword123'); 
        await driver.executeScript('arguments[0].scrollIntoView(true);', loginButton);
        await driver.wait(until.elementIsVisible(loginButton), 5000);
        await driver.executeScript('arguments[0].click();', loginButton);
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
