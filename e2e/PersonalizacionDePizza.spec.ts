import { test, expect } from "@playwright/test";
import { login } from "./helpers/login";

test.describe("Historia: Selección y Personalización de Pizza", () => {

  test("No permite seleccionar más de 3 toppings y muestra toast", async ({ page }) => {
    // 1️⃣ Inicio de sesión y navegación
    await login(page); 
    await page.goto("http://localhost:3000/menu");
    await expect(page).toHaveURL(/menu/);

    // 2️⃣ Localizar la tarjeta de Pizza5 y abrir personalización
    // Seleccionamos el botón de configuración (el que NO dice "Add")
    const pizzaCard = page.locator('div').filter({ 
      has: page.locator('h3', { hasText: 'Pizza5' }) 
    }).last();
    
    await pizzaCard.locator('button').filter({ hasNotText: /add/i }).click();

    // 3️⃣ Validar que el modal se abrió correctamente
    const modalHeading = page.getByRole('heading', { name: 'Toppings extra (máx. 3)' });
    await expect(modalHeading).toBeVisible();

    // 4️⃣ Seleccionar 4 toppings para disparar el límite
    const toppings = ["Topping1", "Topping4", "Topping5", "Topping3"];
    for (const topping of toppings) {
      await page.getByRole('button', { name: new RegExp(topping, 'i') }).click();
    }

    // 5️⃣ SOLUCIÓN DEFINITIVA AL TOAST:
    // Usamos 'li[role="status"]' para diferenciarlo del 'span' oculto
    const toast = page.locator('li[role="status"]').filter({ hasText: 'Maximum toppings reached' });
    
    // Verificamos visibilidad con un pequeño margen de tiempo por la animación
    await expect(toast).toBeVisible({ timeout: 8000 });
    
    // Verificamos el mensaje secundario dentro del mismo toast
    await expect(toast).toContainText('You can only select up to 3 toppings.');

    // 6️⃣ Cerrar el modal para finalizar el flujo limpiamente
    // Buscamos el botón 'Cancelar' que aparece en el modal
    await page.getByRole('button', { name: /cancelar/i }).click();
    
    // Verificamos que el modal realmente se haya cerrado
    await expect(modalHeading).not.toBeVisible();
  });

});