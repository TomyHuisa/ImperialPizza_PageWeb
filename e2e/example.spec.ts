import { test, expect } from "@playwright/test";
test.describe("Canjeo de puntos", () => {

test("Interfaz indicador de puntos totales en cuenta", async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.locator('div').filter({ hasText: /^250 pts$/ })).toBeVisible();
  await page.getByRole('button', { name: 'Add' }).nth(1).click();
  await page.getByRole('button', { name: '1' }).click();
  await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
  await page.getByRole('button', { name: 'TakeAway ~20 min' }).click();
  await page.getByRole('textbox', { name: 'Full Name' }).click();
  await page.getByRole('textbox', { name: 'Full Name' }).fill('test1');
  await page.getByRole('textbox', { name: 'Phone Number' }).click();
  await page.getByRole('textbox', { name: 'Phone Number' }).fill('1234');
  await expect(page.getByText('Redeem PointsYou have 250')).toBeVisible();
  await page.getByRole('slider').cliack();
  await page.locator('.bg-muted').click();
  await expect(page.getByText('Points Discount-$')).toBeVisible();
  await page.getByRole('button', { name: 'Place Order - $' }).click();
});
})