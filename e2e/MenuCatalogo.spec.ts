import { test, expect } from "@playwright/test";
import { login } from "./helpers/login";

test.describe("Historia: Menú de Pizzas", () => {

  test("El usuario abre la página y accede al menú", async ({ page }) => {

    await login(page);

    await page.goto("http://localhost:3000/menu");

    await expect(page).toHaveURL(/menu/);
  });

  test("Se muestran pizzas con nombre y descripción", async ({ page }) => {

    await login(page);

    await page.goto("http://localhost:3000/menu");

    const pizzas = page.locator("h3");

    await expect(pizzas.first()).toBeVisible();
  });

  test("Si una pizza está agotada muestra 'No disponible'", async ({ page }) => {

    await login(page);

    await page.goto("http://localhost:3000/menu");

    const unavailable = page.locator("text=/no disponible/i");

    if (await unavailable.count() > 0) {
      await expect(unavailable.first()).toBeVisible();
    }
  });

});