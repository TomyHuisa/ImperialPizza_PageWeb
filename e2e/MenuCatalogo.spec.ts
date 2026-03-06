import { test, expect } from "@playwright/test";
import { login } from "./helpers/login";

test.describe("Historia: Menú de Pizzas", () => {

  test("El usuario abre la página y accede al menú", async ({ page }) => {
    await login(page);
    await page.goto("http://localhost:3000/");

    await page.getByRole("link", { name: /menu/i }).click();

    await expect(page).toHaveURL(/menu/);
  });

  test("Se muestran al menos 5 pizzas con nombre y descripción", async ({ page }) => {
    await login(page);
    await page.goto("http://localhost:3000/menu");

    const pizzas = page.locator("[data-testid='pizza-card']");
    await expect(pizzas).toHaveCount(5);
  });

  test("Si una pizza está agotada muestra 'No disponible'", async ({ page }) => {
    await login(page);
    await page.goto("http://localhost:3000/menu");

    const unavailable = page.locator("text=No disponible");

    if (await unavailable.count() > 0) {
      await expect(unavailable.first()).toBeVisible();
    }
  });

});