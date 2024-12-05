import { describe, test, beforeAll, afterAll, expect } from 'vitest';
import { getChromeDriver } from './SeleniumSetup';
import { clickElementByText, fillInputField, navigateToUrl } from './NavigationHelper';
import { By, until } from 'selenium-webdriver';
import fs from 'fs';


declare global {
    interface Window {
      __coverage__: unknown;
    }
  }
describe('Reset Registry Button Display Check', () => {
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

    test('Verify that "Reset Registry" button is displayed', async () => {
        // Navigate to the "Reset Registry" page
        await clickElementByText(driver, 'Reset Registry');
        
        // Check that the "Reset Registry" button is displayed
        const resetButton = await driver.wait(until.elementLocated(By.xpath("//button[text()='Reset Registry']")), 5000);
        const isDisplayed = await resetButton.isDisplayed();
        
        expect(isDisplayed).toBe(true); // Verify the button is displayed
    });
});
