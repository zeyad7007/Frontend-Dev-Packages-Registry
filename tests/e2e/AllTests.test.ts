import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { getChromeDriver } from './SeleniumSetup';
import { fillInputField, clickElementByText, navigateToUrl } from './NavigationHelper';
import { By, until } from 'selenium-webdriver';
import fs from 'fs';

declare global {
  interface Window {
    __coverage__: unknown;
  }
}

describe('Comprehensive Package Registry Tests', () => {
  let driver;
  const uploadedPackage = { id: '', name: '', version: '' };

  beforeAll(async () => {
    driver = await getChromeDriver();
    await driver.get('https://frontend-dev-packages-registry.vercel.app/home');

    // Perform login
    const usernameInput = await driver.findElement(By.id('username-input'));
    const passwordInput = await driver.findElement(By.id('password-input'));
    const loginButton = await driver.findElement(By.id('authenticate-button'));

    await driver.executeScript('arguments[0].scrollIntoView(true);', usernameInput);
    await fillInputField(driver, By.id('username-input'), 'ece30861defaultadminuser');
    await driver.executeScript('arguments[0].scrollIntoView(true);', passwordInput);
    await fillInputField(driver, By.id('password-input'), 'correcthorsebatterystaple123(!__+@**(A\'"`;DROP TABLE packages;');
    await driver.executeScript('arguments[0].scrollIntoView(true);', loginButton);
    await driver.wait(until.elementIsVisible(loginButton), 5000);
    await driver.executeScript('arguments[0].click();', loginButton);
    await new Promise(resolve => setTimeout(resolve, 5000));

  });

  afterAll(async () => {
    const coverage = await driver.executeScript(() => window.__coverage__);

    if (coverage) {
      fs.writeFileSync('./.nyc_output/coverage-final.json', JSON.stringify(coverage));
    }

    await driver.quit();
  });

  /**
   * Test Cases Begin
   */

  // Upload Package with GitHub URL and save data
  test('Upload Package with GitHub URL and Save Data', async () => {
    await clickElementByText(driver, 'Upload Package');

    uploadedPackage.name = `ExpressPackage_${Date.now()}`;
    uploadedPackage.version = '1.0.0';
    await fillInputField(driver, By.xpath("//input[@placeholder='Package Name']"), uploadedPackage.name);
    await fillInputField(driver, By.xpath("//textarea[@placeholder='JS Program']"), 'console.log("GitHub Upload Test");');
    await fillInputField(
      driver,
      By.xpath("//input[@placeholder='GitHub Repo URL']"),
      'https://github.com/expressjs/express'
    );

    const debloatCheckbox = await driver.findElement(By.xpath("//input[@type='checkbox' and @name='debloat']"));
    await driver.executeScript('arguments[0].scrollIntoView(true);', debloatCheckbox);
    if (!(await debloatCheckbox.isSelected())) {
      await debloatCheckbox.click();
    }

    const uploadButton = await driver.findElement(By.xpath("//button[text()='Upload Package']"));
    await driver.executeScript('arguments[0].scrollIntoView(true);', uploadButton);
    await driver.wait(until.elementIsVisible(uploadButton), 5000);
    await driver.wait(until.elementIsEnabled(uploadButton), 5000);
    await driver.executeScript('arguments[0].click();', uploadButton);

    const successMessage = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Package uploaded with ID:')]")),
      10000
    );
    const messageText = await successMessage.getText();
    const idMatch = messageText.match(/ID: (\d+)/);
    uploadedPackage.id = idMatch ? idMatch[1] : '';
    expect(uploadedPackage.id).not.toBe('');
  });

  // Reset Registry Button Test
  test('Reset Registry Button Display Check', async () => {
    await clickElementByText(driver, 'Reset Registry');

    const resetButton = await driver.wait(until.elementLocated(By.xpath("//button[text()='Reset Registry']")), 5000);
    expect(await resetButton.isDisplayed()).toBe(true);
  });

  // Get Packages Test Cases
  test('Get Packages - Success and Failure', async () => {
    await clickElementByText(driver, 'Get Packages');

    // Successful retrieval
    await fillInputField(driver, By.xpath("//input[@placeholder='Enter Package Name']"), uploadedPackage.name);
    await fillInputField(driver, By.xpath("//input[@placeholder='Enter Version']"), uploadedPackage.version);
    await fillInputField(driver, By.xpath("//input[@placeholder='Enter Offset']"), '0');

    const loadButton = await driver.findElement(By.xpath("//button[text()='Load Packages']"));
    await driver.executeScript("arguments[0].scrollIntoView(true);", loadButton);
    await driver.executeScript("arguments[0].click();", loadButton);

    const packageNameElement = await driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(),'${uploadedPackage.name}')]`)),
      5000
    );
    expect(await packageNameElement.getText()).toContain(uploadedPackage.name);

    // Failure case
    await fillInputField(driver, By.xpath("//input[@placeholder='Enter Package Name']"), 'InvalidPackage');
    await fillInputField(driver, By.xpath("//input[@placeholder='Enter Version']"), '0.0.0');
    await driver.executeScript("arguments[0].click();", loadButton);

    const errorMessage = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'No packages found')]")), 5000);
    expect(await errorMessage.getText()).toBe('No packages found');
  });

  // Get Package by ID Test Cases
  test('Get Package by ID - Success and Failure', async () => {
    await clickElementByText(driver, 'Get Package by ID');
    await fillInputField(driver, By.xpath("//input[@placeholder='Enter Package ID']"), uploadedPackage.id);
    await clickElementByText(driver, 'Fetch Package');

    const packageNameElement = await driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(),'${uploadedPackage.name}')]`)),
      5000
    );
    expect(await packageNameElement.getText()).toContain(uploadedPackage.name);

    // Failure case
    await fillInputField(driver, By.xpath("//input[@placeholder='Enter Package ID']"), '0');
    await clickElementByText(driver, 'Fetch Package');
    const errorMessage = await driver.wait(until.elementLocated(By.id('error')), 5000);
    expect(await errorMessage.getText()).toBe("Error 404: Package doesn't exist");
  });

  // Additional Test Cases
  test('Get Package Cost', async () => {
    await clickElementByText(driver, 'Get Package Cost');
    await fillInputField(driver, By.id('package-id-input'), uploadedPackage.id);
    await clickElementByText(driver, 'Fetch Cost');

    const costDetails = await driver.wait(until.elementLocated(By.id('cost-details')), 5000);
    expect(await costDetails.isDisplayed()).toBe(true);
  });

  test('Get Package Rating', async () => {
    await clickElementByText(driver, 'Get Package Rating');
    await fillInputField(driver, By.id('package-id-input'), uploadedPackage.id);
    await clickElementByText(driver, 'Fetch Rating');

    const ratingDetails = await driver.wait(until.elementLocated(By.id('rating-details')), 5000);
    expect(await ratingDetails.isDisplayed()).toBe(true);
  });

  test('Search by Regex', async () => {
    await clickElementByText(driver, 'Search by Regex');
    await fillInputField(driver, By.xpath("//input[@placeholder='Enter Regex']"), uploadedPackage.name);
    await clickElementByText(driver, 'Search');

    const packageNameElement = await driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(),'${uploadedPackage.name}')]`)),
      5000
    );
    expect(await packageNameElement.getText()).toBe(uploadedPackage.name);
  });

  test('Update Package by ID', async () => {
    await clickElementByText(driver, 'Update Package by ID');

    const updateButton = await driver.findElement(By.id('update-package-button'));
    expect(await updateButton.isDisplayed()).toBe(true);
  });

  test('Verify Planned Tracks', async () => {
    await navigateToUrl(driver, 'https://frontend-dev-packages-registry.vercel.app/tracks');

    const plannedTracksHeading = await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'Planned Tracks')]")),
      5000
    );
    expect(await plannedTracksHeading.isDisplayed()).toBe(true);
  });
});
