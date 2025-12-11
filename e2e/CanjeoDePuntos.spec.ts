import { test, expect } from "@playwright/test";
test.describe("Canjeo de puntos", () => {

test("Interfaz indicador de puntos totales en cuenta", async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await expect(page.getByText('Imperial PizzeriaHomeMenuTrack Order250 ptsLogin')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^250 pts$/ })).toBeVisible();
  await expect(page.getByRole('navigation')).toContainText('250 pts');
});

test("Descuentos de puntos por items de la lista de compras", async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await page.getByRole('button', { name: 'Order Now' }).click();
  await page.getByRole('button', { name: 'Add' }).nth(1).click();
  await page.getByRole('button', { name: 'Add' }).first().click();
  await page.getByRole('button', { name: '2' }).click();
  await expect(page.locator('div').filter({ hasText: 'Pepperoni Reale1$16.99Use' }).nth(3)).toBeVisible();
  await expect(page.getByText('Use points for this item25 points = $2.00 discountAvailable for this item: 250').first()).toBeVisible();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
  await expect(page.getByText('Points:0($0.00)$0.00 discount0 pts$16.96')).toBeVisible();
  await expect(page.getByText('Order Summary1x Pepperoni')).toBeVisible();
  await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
  await expect(page.getByText('Points Discount-$')).toBeVisible()
})
})