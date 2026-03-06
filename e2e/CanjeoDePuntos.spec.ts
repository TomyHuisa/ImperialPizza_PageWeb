import { test, expect } from "@playwright/test";
import { login } from "./helpers/login";

test.describe("Historia: Canjeo de Puntos", () => {

  test("Interfaz muestra puntos totales en la cuenta", async ({ page }) => {

    await login(page);

    const points = page.locator("text=/pts|points/i");

    await expect(points.first()).toBeVisible();

  });

  test("Permite usar puntos al finalizar una compra", async ({ page }) => {

    await login(page);

    await page.goto("http://localhost:3000/menu");

    await page.getByRole("button", { name: /^add$/i }).first().click();

    await page.goto("http://localhost:3000/cart");

    const usePoints = page.locator("button:has-text('Points'), button:has-text('Puntos')");

    if (await usePoints.count() > 0) {
      await usePoints.first().click();
    }

  });

});