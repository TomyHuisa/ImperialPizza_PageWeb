import { test, expect } from "@playwright/test"

test.describe("Historia: Selección y Personalización de Pizza", () => {

  test("No permite seleccionar más de 3 toppings y muestra toast", async ({ page }) => {

    await page.goto("http://localhost:3000/")

    // Ir al menú
    await page.getByRole("link", { name: /menú/i }).click()

    // Abrir personalización
await page.getByRole("button", { name: "Add" }).first().click()

// Esperar el modal correctamente
await expect(
  page.getByRole("heading", { name: /toppings extra/i })
).toBeVisible()

// Seleccionar toppings
await page.getByText("Topping1").click()
await page.getByText("Topping2").click()
await page.getByText("Topping3").click()

// Intentar el cuarto
await page.getByText("Topping4").click()

// Verificar toast
const toast = page.locator("[role='status']").filter({
  hasText: "Maximum toppings reached"
})

await expect(toast).toBeVisible()

  })

})