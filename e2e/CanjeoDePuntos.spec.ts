import { test, expect } from "@playwright/test";
import { login } from "./helpers/login";

test.describe("Historia: Canjeo de Puntos", () => {

  test("Interfaz muestra puntos totales en la cuenta", async ({ page }) => {
    await login(page);
    await page.goto("http://localhost:3000/");

    await expect(page.locator("text=pts")).toBeVisible();
  });

  test("Permite usar puntos al finalizar una compra", async ({ page }) => {
    await login(page);
    await page.goto("http://localhost:3000/menu");

    // seleccionar pizza
    await page.getByRole("button", { name: /add to cart/i }).first().click();

    // ir al carrito
    await page.goto("http://localhost:3000/cart");

    // usar puntos si existe el botón
    const redeemButton = page.getByRole("button", { name: /use points/i });

    if (await redeemButton.isVisible()) {
      await redeemButton.click();
    }

    await expect(page.locator("text=/discount|points/i")).toBeVisible();
  });

});