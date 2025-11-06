import { test, expect } from "@playwright/test";

test.describe("Persistencia en localStorage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("debería persistir carrito en localStorage", async ({ page }) => {
    // Test para guardado en localStorage
  });

  test("debería cargar carrito desde localStorage", async ({ page }) => {
    // Test para carga desde localStorage
  });
});
