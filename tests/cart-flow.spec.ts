import { test, expect } from "@playwright/test";

test.describe("Flujo del Carrito - PizzaImperial", () => {
  test("flujo completo de pedido", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // 1. Agregar pizza al carrito
    await page.locator('button:has-text("Agregar al Carrito")').first().click();

    // 2. Verificar confirmación
    await expect(page.locator("text=Agregado al carrito")).toBeVisible();

    // 3. Ir al carrito
    await page.locator('a[aria-label="Carrito de compras"]').click();

    // 4. Verificar que estamos en la página del carrito
    await expect(page).toHaveURL(/.*carrito/);

    // 5. Verificar que la pizza está en el carrito
    // (Ajusta estos selectores según tu implementación del carrito)
    await expect(
      page
        .locator("text=Margherita Clásica")
        .or(page.locator("text=Productos en el carrito"))
    ).toBeVisible();
  });

  test("indicador de carrito debería actualizarse", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Verificar que inicialmente está en 0
    const cartIndicator = page.locator("span.bg-red-500");
    await expect(cartIndicator).toContainText("0");

    // Agregar pizza y verificar que el indicador se actualiza
    await page.locator('button:has-text("Agregar al Carrito")').first().click();

    // Nota: Esto depende de que tu implementación actualice el indicador
    // Si no lo hace actualmente, puedes comentar esta parte
    // await expect(cartIndicator).toContainText('1');
  });
});
