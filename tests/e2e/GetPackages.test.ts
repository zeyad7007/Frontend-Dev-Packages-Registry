import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { getChromeDriver } from './SeleniumSetup';
import { fillInputField, waitForElement, clickElementByText, navigateToUrl } from './NavigationHelper';
import { By, until } from 'selenium-webdriver';
import fs from 'fs';


declare global {
    interface Window {
      __coverage__: unknown;
    }
  }
describe('Get Packages Functionality', () => {
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

    test('Open Get Packages and verify UI elements', async () => {
        await clickElementByText(driver, 'Get Packages');

        await waitForElement(driver, By.xpath("//input[@placeholder='Enter Package Name']"));
        await waitForElement(driver, By.xpath("//input[@placeholder='Enter Version']"));
        await waitForElement(driver, By.xpath("//button[text()='Add Another Query']"));
        await waitForElement(driver, By.xpath("//button[text()='Remove']"));
        await waitForElement(driver, By.xpath("//input[@placeholder='Enter Offset']"));
        await waitForElement(driver, By.xpath("//button[text()='Load Packages']"));
    });

    test('Retrieve a package by name, version, and offset', async () => {
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Package Name']"), 'Test1');
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Version']"), '1.0.0');
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Offset']"), '0');
        
        const loadButton = await driver.findElement(By.xpath("//button[text()='Load Packages']"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", loadButton);
        await driver.wait(until.elementIsVisible(loadButton), 5000);
        await driver.executeScript("arguments[0].click();", loadButton);
    
        const packageNameElement = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Test1')]")),
            5000
        );
        await driver.executeScript("arguments[0].scrollIntoView(true);", packageNameElement);
    
        const versionLabelElement = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Version:')]")),
            5000
        );
        await driver.executeScript("arguments[0].scrollIntoView(true);", versionLabelElement);
    
        const packageName = await packageNameElement.getText();
        const packageVersionLabel = await versionLabelElement.getText();
    
        expect(packageName).toContain('Test1');
        expect(packageVersionLabel).toBe('Version: 1.0.0');
    }, 5000);
    
    test('Handle invalid package retrieval', async () => {
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Package Name']"), 'InvalidPackage');
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Version']"), '0.0.0');
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Offset']"), '0');

        const loadButton = await driver.findElement(By.xpath("//button[text()='Load Packages']"));
        
        await driver.executeScript("arguments[0].scrollIntoView(true);", loadButton);
        await driver.wait(until.elementIsVisible(loadButton), 5000);
        await driver.executeScript("arguments[0].click();", loadButton);

        await waitForElement(driver, By.xpath("//*[contains(text(),'No packages found')]")); 
        const errorMessage = await driver.findElement(By.xpath("//*[contains(text(),'No packages found')]")).getText();
        expect(errorMessage).toBe('No packages found'); 
    });
});
