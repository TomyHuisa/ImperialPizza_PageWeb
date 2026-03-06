import { test, expect } from "@playwright/test";
import { login } from "./helpers/login";

test.describe("Historia: Selección y Personalización de Pizza", () => {

  test("El usuario puede seleccionar una pizza", async ({ page }) => {
    await login(page);
    await page.goto("http://localhost:3000/menu");

    await page.getByRole("button", { name: /customize/i }).first().click();
  });

  test("Existe botón para personalizar el pedido", async ({ page }) => {
    await login(page);
    await page.goto("http://localhost:3000/menu");

    const customize = page.getByRole("button", { name: /customize/i });
    await expect(customize.first()).toBeVisible();
  });

  test("Aparecen 5 toppings disponibles", async ({ page }) => {
    await login(page);
    await page.goto("http://localhost:3000/menu");

    await page.getByRole("button", { name: /customize/i }).first().click();

    const toppings = page.locator("[data-testid='topping-option']");
    await expect(toppings).toHaveCount(5);
  });

  test("No permite seleccionar más de 3 toppings y muestra toast", async ({ page }) => {
    await login(page);
    await page.goto("http://localhost:3000/menu");

    await page.getByRole("button", { name: /customize/i }).first().click();

    const toppings = page.locator("[data-testid='topping-option']");

    await toppings.nth(0).click();
    await toppings.nth(1).click();
    await toppings.nth(2).click();

    // intentar cuarto
    await toppings.nth(3).click();

    await expect(page.locator("text=Maximum toppings reached")).toBeVisible();
    await expect(page.locator("text=You can only select up to 3 toppings")).toBeVisible();
  });

  test("Al finalizar pedido se agregan puntos al perfil", async ({ page }) => {
    await login(page);
    await page.goto("http://localhost:3000/menu");

    await page.getByRole("button", { name: /add to cart/i }).first().click();

    await page.goto("http://localhost:3000/cart");

    const checkout = page.getByRole("button", { name: /checkout|order|pay/i });

    if (await checkout.isVisible()) {
      await checkout.click();
    }

    await expect(page.locator("text=pts")).toBeVisible();
  });

});