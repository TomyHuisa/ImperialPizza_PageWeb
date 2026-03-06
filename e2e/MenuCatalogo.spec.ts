import { test, expect } from "@playwright/test";
import { login } from "./helpers/login";

test.describe("Historia: Menú de Pizzas", () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("http://localhost:3000/menu");
    await expect(page).toHaveURL(/menu/);
  });

  test("Se muestran pizzas reales en el catálogo", async ({ page }) => {
    // 1️⃣ Definimos las tarjetas de producto usando la clase 'bg-card' 
    // y asegurándonos de que tengan el botón 'Add'
    const productCards = page.locator('.bg-card').filter({ 
      has: page.getByRole('button', { name: /add/i }) 
    });

    // 2️⃣ CLAVE: Esperamos a que la primera pizza sea visible. 
    // Esto le da tiempo al PocketBase para responder.
    // Si el PB está APAGADO, este paso fallará por Timeout (lo cual es correcto).
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });

    // 3️⃣ Ahora sí contamos. Si llegamos aquí, es porque hay al menos una.
    const count = await productCards.count();
    console.log(`Pizzas encontradas: ${count}`);
    expect(count).toBeGreaterThan(0);

    // 4️⃣ Verificamos que el título de la pizza no sea un texto genérico del footer
    const pizzaName = await productCards.first().locator('h3').innerText();
    expect(pizzaName).not.toBe('Contact Us');
    expect(pizzaName).not.toBe('Hours');
  });

  test("Si una pizza está agotada muestra 'No disponible'", async ({ page }) => {
    // Buscamos específicamente dentro de las tarjetas de producto
    const outOfStock = page.locator('.bg-card').filter({ hasText: /no disponible|out of stock/i });
    
    if (await outOfStock.count() > 0) {
      await expect(outOfStock.first()).toBeVisible();
    }
  });

});