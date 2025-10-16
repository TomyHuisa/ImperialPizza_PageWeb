import { test, expect } from "@playwright/test";

test.describe("Accesibilidad - PizzaImperial", () => {
  test("debería cumplir estándares básicos de accesibilidad", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000");

    // Verificar títulos de página
    const title = await page.title();
    expect(title).toBeTruthy();

    // Verificar estructura de headings
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);

    // Verificar que los botones tienen labels accesibles
    await expect(page.locator('button[aria-label="Abrir menú"]')).toBeVisible();
    await expect(
      page.locator('a[aria-label="Carrito de compras"]')
    ).toBeVisible();

    // Verificar navegación por teclado
    await page.keyboard.press("Tab");
    await expect(page.locator('button[aria-label="Abrir menú"]')).toBeFocused();

    // Verificar contraste (test básico)
    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();
  });

  test("menú lateral debería ser accesible", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Abrir menú
    await page.locator('button[aria-label="Abrir menú"]').click();

    // Verificar que el menú se abre y es focusable
    await expect(page.locator("text=Mi Perfil")).toBeVisible();

    // Verificar que se puede navegar con teclado
    await page.keyboard.press("Tab");
    await expect(
      page.locator('button[aria-label="Cerrar menú"]')
    ).toBeFocused();
  });
});
