import { test, expect } from "@playwright/test";
test.describe("Canjeo de puntos", () => {

test("Interfaz indicador de puntos totales en cuenta", async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByText('Imperial PizzeriaHomeMenuTrack Order250 ptsLogin')).toBeVisible(); 
  // Verifica que el texto principal del header esté visible y que el mismo incluya nombre del sitio, navegación y puntos disponibles
  await expect(page.locator('div').filter({ hasText: /^250 pts$/ })).toBeVisible();
  // Verifica que la pagina tenga un "Div" en la cual sea visible un texto indicativo de puntos de la cuenta
  await expect(page.getByRole('navigation')).toContainText('250 pts');
  // Verifica que dentro del navbar se contenga un texto indicando el total de puntos
});

test("Descuentos de puntos por items de la lista de compras", async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Order Now' }).click();      //|
  await page.getByRole('button', { name: 'Add' }).nth(1).click();     //| Verifican que exista un rol de boton
  await page.getByRole('button', { name: 'Add' }).first().click();    //| para luego darle click
  await page.getByRole('button', { name: '2' }).click();              //| <--- En este caso da click y cambio los valores para la cantidad
  await expect(page.locator('div').filter({ hasText: 'Pepperoni Reale1$16.99Use' }).nth(3)).toBeVisible(); // Verifica que haya un "Div" con el texto del pedido que hiciste
  await expect(page.getByText('Use points for this item25 points = $2.00 discountAvailable for this item: 250').first()).toBeVisible(); // Verifica que haya un texto que indique el descuento por puntos
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click(); // Verificacion de un boton para usar los puntos
  await expect(page.getByText('Points:0($0.00)$0.00 discount0 pts$16.96')).toBeVisible(); // Verifica que el texto se visualizae los puntos que se usaron para descontar el precio por el pedido
  await expect(page.getByText('Order Summary1x Pepperoni')).toBeVisible(); // Verificacion de visualizacion del resumen del pedido 
  await page.getByRole('button', { name: 'Proceed to Checkout' }).click(); // Verifica la existencia de un boton para proceder al checkout
  await expect(page.getByText('Points Discount-$')).toBeVisible() // Verifica que en el checkout muestre la cantidad de puntos se usaron con anterioridad
})
})