import { test, expect } from "@playwright/test";

test.describe("PizzaImperial - Funcionalidades Principales", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("debería mostrar la página principal con el título correcto", async ({
    page,
  }) => {
    await expect(page.locator("h1")).toContainText("Pizzeria Imperial");
    await expect(page.locator("text=Auténtica pizzas")).toBeVisible();
  });

  test("debería mostrar la sección de pizzas con productos", async ({
    page,
  }) => {
    await expect(page.locator('h2:has-text("Nuestras Pizzas")')).toBeVisible();
    await expect(page.locator("text=Margherita Clásica")).toBeVisible();
    await expect(page.locator("text=Pepperoni Suprema")).toBeVisible();
  });

  test("debería permitir agregar pizzas al carrito", async ({ page }) => {
    // Buscar botones de agregar al carrito (disponibles)
    const addToCartButtons = page.locator(
      'button:has-text("Agregar al Carrito")'
    );
    await expect(addToCartButtons.first()).toBeVisible();

    // Agregar primera pizza al carrito
    await addToCartButtons.first().click();

    // Verificar que aparece el toast de confirmación
    await expect(page.locator("text=Agregado al carrito")).toBeVisible();
    await expect(
      page.locator("text=ha sido agregada a tu pedido")
    ).toBeVisible();
  });

  test("debería mostrar pizzas no disponibles correctamente", async ({
    page,
  }) => {
    // Buscar botones de no disponibles
    const unavailableButtons = page.locator('button:has-text("No Disponible")');

    // Intentar hacer clic en uno no disponible
    if (await unavailableButtons.first().isVisible()) {
      await unavailableButtons.first().click();
      await expect(
        page.locator("text=Producto no disponible actualmente")
      ).toBeVisible();
    }
  });

  test("debería navegar entre categorías de pizza", async ({ page }) => {
    // Verificar que la categoría clásica está activa por defecto
    await expect(page.locator("button.bg-red-600").first()).toContainText(
      "Pizzas Clásicas"
    );

    // Cambiar a categoría especiales
    await page.locator('button:has-text("Pizzas Especiales")').click();
    await expect(page.locator("text=Quattro Formaggi")).toBeVisible();

    // Cambiar a categoría vegetarianas
    await page.locator('button:has-text("Pizzas Vegetarianas")').click();
    await expect(page.locator("text=Vegetariana Mediterránea")).toBeVisible();

    // Probar categoría personalizar
    await page
      .locator('button:has-text("Personaliza tu propia pizza")')
      .click();
    await expect(page.locator("text=Personaliza tu pizza")).toBeVisible();
  });

  test("debería abrir y cerrar el menú lateral", async ({ page }) => {
    // Abrir menú hamburguesa
    await page.locator('button[aria-label="Abrir menú"]').click();

    // Verificar que el menú se abre
    await expect(page.locator("text=Mi Perfil")).toBeVisible();
    await expect(page.locator("text=Historial de pedidos")).toBeVisible();

    // Cerrar menú
    await page.locator('button[aria-label="Cerrar menú"]').click();

    // Verificar que el menú se cierra
    await expect(page.locator("text=Mi Perfil")).not.toBeVisible();
  });

  test("debería navegar al carrito desde el header", async ({ page }) => {
    // Hacer clic en el ícono del carrito
    await page.locator('a[aria-label="Carrito de compras"]').click();

    // Verificar que navegó a la página del carrito
    await expect(page).toHaveURL(/.*carrito/);
  });
});

test.describe("PizzaImperial - Responsive", () => {
  test("debería ser responsive en mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("http://localhost:3000");

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('button[aria-label="Abrir menú"]')).toBeVisible();
  });

  test("debería ser responsive en tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("http://localhost:3000");

    await expect(page.locator("h1")).toBeVisible();
    // Verificar que el grid se adapta
    await expect(page.locator(".grid-cols-1")).toBeVisible();
  });
});
