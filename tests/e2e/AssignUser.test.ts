import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { getChromeDriver } from './SeleniumSetup';
import { fillInputField, waitForElement } from './NavigationHelper';
import { By, until } from 'selenium-webdriver';
import fs from 'fs';

describe('Assign User to Group Functionality', () => {
  let driver;

  beforeAll(async () => {
    driver = await getChromeDriver();

    // Navigate to login page
    await driver.get('http://localhost:5173/login');

    // Perform login
    const usernameInput = await driver.findElement(By.id('username-input')); // Replace with the actual ID of the username field
    const passwordInput = await driver.findElement(By.id('password-input')); // Replace with the actual ID of the password field
    const loginButton = await driver.findElement(By.id('authenticate-button')); // Replace with the actual ID of the login button

    await driver.executeScript('arguments[0].scrollIntoView(true);', usernameInput);
    await fillInputField(driver, By.id('username-input'), 'adminUser'); // Replace with valid admin username
    await driver.executeScript('arguments[0].scrollIntoView(true);', passwordInput);
    await fillInputField(driver, By.id('password-input'), 'adminPassword123'); // Replace with valid admin password
    await driver.executeScript('arguments[0].scrollIntoView(true);', loginButton);
    await driver.wait(until.elementIsVisible(loginButton), 5000);
    await driver.executeScript('arguments[0].click();', loginButton);

    // Wait for successful login
    await waitForElement(driver, By.id('fuwwah')); // Replace with an ID unique to the home page after login

    // Navigate to Assign User page
    await driver.get('http://localhost:5173/admin-actions/assign-user');
  });

  afterAll(async () => {
    const coverage = await driver.executeScript(() => window.__coverage__);
    if (coverage) {
      fs.writeFileSync('./.nyc_output/coverage-final.json', JSON.stringify(coverage));
    }
    await driver.quit();
  });

  test('Verify form elements', async () => {
    const userIdInput = await driver.findElement(By.id('userIdInput'));
    const groupIdInput = await driver.findElement(By.id('groupIdInput'));
    const assignButton = await driver.findElement(By.id('submitButton'));

    await driver.executeScript('arguments[0].scrollIntoView(true);', userIdInput);
    expect(await userIdInput.isDisplayed()).toBe(true);

    await driver.executeScript('arguments[0].scrollIntoView(true);', groupIdInput);
    expect(await groupIdInput.isDisplayed()).toBe(true);

    await driver.executeScript('arguments[0].scrollIntoView(true);', assignButton);
    expect(await assignButton.isDisplayed()).toBe(true);
  });

  test('Submit valid inputs and validate success message', async () => {
    const userIdInput = await driver.findElement(By.id('userIdInput'));
    const groupIdInput = await driver.findElement(By.id('groupIdInput'));
    const submitButton = await driver.findElement(By.id('submitButton'));

    await driver.executeScript('arguments[0].scrollIntoView(true);', userIdInput);
    await fillInputField(driver, By.id('userIdInput'), '5');

    await driver.executeScript('arguments[0].scrollIntoView(true);', groupIdInput);
    await fillInputField(driver, By.id('groupIdInput'), '4');

    await driver.executeScript('arguments[0].scrollIntoView(true);', submitButton);
    await driver.wait(until.elementIsVisible(submitButton), 5000);
    await driver.executeScript('arguments[0].click();', submitButton);

    await waitForElement(driver, By.id('successMessage'), 5000);
    const successMessage = await driver.findElement(By.id('successMessage'));
    await driver.executeScript('arguments[0].scrollIntoView(true);', successMessage);
    expect(await successMessage.getText()).toContain('User assigned to a new group');
  });

  test('Submit invalid inputs and validate error message', async () => {
    const userIdInput = await driver.findElement(By.id('userIdInput'));
    const groupIdInput = await driver.findElement(By.id('groupIdInput'));
    const submitButton = await driver.findElement(By.id('submitButton'));

    await driver.executeScript('arguments[0].scrollIntoView(true);', userIdInput);
    await fillInputField(driver, By.id('userIdInput'), '999');

    await driver.executeScript('arguments[0].scrollIntoView(true);', groupIdInput);
    await fillInputField(driver, By.id('groupIdInput'), '999');

    await driver.executeScript('arguments[0].scrollIntoView(true);', submitButton);
    await driver.wait(until.elementIsVisible(submitButton), 5000);
    await driver.executeScript('arguments[0].click();', submitButton);

    await waitForElement(driver, By.id('errorMessage'), 5000);
    const errorMessage = await driver.findElement(By.id('errorMessage'));
    await driver.executeScript('arguments[0].scrollIntoView(true);', errorMessage);
    expect(await errorMessage.getText()).toContain('Error 404:');
  });
});
