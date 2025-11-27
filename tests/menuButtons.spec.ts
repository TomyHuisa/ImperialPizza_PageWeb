import { test, expect } from '@playwright/test';

test('Botones de catalogo de pizzas', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Pizzas Clásicas Las favoritas' }).click();
  await page.getByRole('button', { name: 'Pizzas Especiales Nuestras' }).click();
  await page.getByRole('button', { name: 'Pizzas Vegetarianas Sabores' }).click();
  await page.getByRole('button', { name: 'Personaliza Crea tu propia' }).click();
  await page.getByRole('link', { name: 'Ver Menú' }).click();
});


test('Botones de la carta de pizza', async ({ page }) => {
  await page.goto('http://localhost:3000/#menu');
  await page.getByRole('button', { name: 'Agregar al Carrito' }).first().click();
  await page.getByRole('textbox', { name: 'Comentario:' }).click();
  await page.getByRole('textbox', { name: 'Comentario:' }).fill('Mas Queso');
  await page.getByRole('button', { name: 'Agregar al Carrito' }).nth(2).click();
  await page.getByRole('button', { name: 'Agregar al Carrito' }).first().click();
  await page.getByRole('button', { name: 'Cancelar' }).click();
  await page.getByRole('button', { name: 'Agregar al Carrito' }).first().click();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(2).click();
});
