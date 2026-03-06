import { test, expect } from "@playwright/test";
import { login } from "./helpers/login";

test.describe("Historia: Menú de Pizzas", () => {

  test.beforeEach(async ({ page }) => {
    // Aseguramos login y navegación antes de cada test
    await login(page);
    await page.goto("http://localhost:3000/menu");
    // Esperamos a que la URL sea la correcta para evitar contar elementos de la página anterior
    await expect(page).toHaveURL(/menu/);
  });

  test("El usuario abre la página y accede al menú", async ({ page }) => {
    // Verificación básica de que la carga fue exitosa
    await expect(page.getByText(/Our Menu/i)).toBeVisible();
  });

  test("Se muestran pizzas reales en el catálogo", async ({ page }) => {
    // 1️⃣ Usamos el selector de clase .bg-card para identificar tarjetas de producto reales
    // y filtramos por las que tienen el botón "Add" para no confundir con el footer.
    const productCards = page.locator('.bg-card').filter({ 
      has: page.getByRole('button', { name: /add/i }) 
    });

    // 2️⃣ IMPORTANTE: Esperamos a que aparezca la primera pizza. 
    // Esto da tiempo al PocketBase para responder. Sin esto, el conteo daría 0.
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });

    const count = await productCards.count();
    console.log(`Pizzas encontradas: ${count}`);
    expect(count).toBeGreaterThan(0);
  });

  test("Si una pizza está agotada muestra 'No disponible'", async ({ page }) => {
    // Buscamos tarjetas que contengan el texto de agotado
    const unavailable = page.locator('.bg-card').filter({ 
      hasText: /no disponible|out of stock/i 
    });

    // Eliminamos el 'if' para que el test sea una prueba real: 
    // Si tu base de datos tiene una pizza agotada (como Pizza6 en tus capturas), debe verla.
    await expect(unavailable.first()).toBeVisible({ timeout: 5000 });
  });

});