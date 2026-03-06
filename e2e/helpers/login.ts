import { Page } from "@playwright/test"

export async function login(page: Page) {

  await page.goto("http://localhost:3000/login")

  // esperar inputs
  await page.waitForSelector("#email")

  await page.locator("#email").fill("customer@imperial.pizza")
  await page.locator("#password").fill("12345678")

  // botón correcto
  await page.getByRole("button", { name: /iniciar sesión/i }).click()

  // esperar redirección
  await page.waitForLoadState("networkidle")
}