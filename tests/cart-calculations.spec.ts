import { test, expect } from "@playwright/test";

test.describe("Cálculos del Carrito", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("debería calcular el precio total correctamente", async ({ page }) => {
    // Test para getTotalPrice function
  });

  test("debería calcular el total de items correctamente", async ({ page }) => {
    // Test para getTotalItems function
  });
});
