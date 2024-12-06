import { WebDriver, By, until } from 'selenium-webdriver';

/**
 * Navigates to a specific URL.
 * @param driver - The Selenium WebDriver instance.
 * @param url - The URL to navigate to.
 */
export async function navigateToUrl(driver: WebDriver, url: string): Promise<void> {
    await driver.get(url);
    await driver.wait(until.urlIs(url), 10000); // Wait until the URL loads (adjust timeout if needed)
}

/**
 * Clicks an element by its text content.
 * @param driver - The Selenium WebDriver instance.
 * @param text - The visible text of the element to click.
 */
export async function clickElementByText(driver: WebDriver, text: string): Promise<void> {
    const element = await driver.findElement(By.xpath(`//*[text()='${text}']`));
    await element.click();
}

export async function clickElementById(driver: WebDriver, id: string): Promise<void> {
    const element = await driver.findElement(By.id(id));
    await element.click();
}

/**
 * Waits for an element to be located and visible, then clicks it.
 * @param driver - The Selenium WebDriver instance.
 * @param locator - The locator (e.g., By.id, By.css, By.xpath) to find the element.
 * @param timeout - Time to wait for the element to be visible (default 5000 ms).
 */
export async function clickElement(driver: WebDriver, locator: By, timeout: number = 5000): Promise<void> {
    const element = await driver.wait(until.elementLocated(locator), timeout);
    await driver.wait(until.elementIsVisible(element), timeout);
    await element.click();
}

/**
 * Fills in a text input field with the provided value.
 * @param driver - The Selenium WebDriver instance.
 * @param locator - The locator (e.g., By.id, By.css, By.xpath) to find the input field.
 * @param value - The value to type into the input field.
 */
export async function fillInputField(driver: WebDriver, locator: By, value: string): Promise<void> {
    const inputField = await driver.findElement(locator);
    await inputField.clear(); // Clears the field before entering text
    await inputField.sendKeys(value);
}

/**
 * Waits for an element to be visible.
 * @param driver - The Selenium WebDriver instance.
 * @param locator - The locator to find the element.
 * @param timeout - Maximum wait time in milliseconds (default 5000 ms).
 */
export async function waitForElement(driver: WebDriver, locator: By, timeout: number = 5000): Promise<void> {
    await driver.wait(until.elementLocated(locator), timeout);
    await driver.wait(until.elementIsVisible(await driver.findElement(locator)), timeout);
}
