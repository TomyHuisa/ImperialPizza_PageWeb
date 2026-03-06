import { Page } from "@playwright/test"

export async function login(page: Page) {

  await page.goto("http://localhost:3000/login")

  // Esperar que aparezca el formulario
  await page.waitForSelector("#email")

  // llenar credenciales
  await page.locator("#email").fill("customer@imperial.pizza")
  await page.locator("#password").fill("12345678")

  // click login
  await page.getByRole("button", { name: /login|sign in/i }).click()

  // esperar redirección al home
  await page.waitForURL("**/")
}