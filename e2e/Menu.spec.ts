import { test, expect } from "@playwright/test";
test.describe("Menu", () => {
  test("El Usuario entra a la pagina", async ({ page }) => {
    await page.goto("http://localhost:3000/");                                                                  //Verifica que se
    await expect(page.getByText("Imperial PizzeriaHomeMenuTrack Order250 ptsLogin")).toBeVisible();             //visualize la pagina
    await expect(page.getByRole("main").locator("rect")).toBeVisible();                                         //principal al entrar
    await expect(page.locator("section").filter({ hasText: "Most PopularView Full" })).toBeVisible();           //a la pagina.
    await expect(page.locator("div").filter({ hasText: "Imperial PizzeriaCrafting" }).nth(1)).toBeVisible();    //
  });

  test("Seleccionar el menu", async ({ page }) => {
    await page.goto("http://localhost:3000/");                                          //
    await expect(page.getByRole("link", { name: "Menu", exact: true })).toBeVisible();  // Verifica que haya un boton para poder ingresar
    await page.getByRole("link", { name: "Menu", exact: true }).click();                // Al menu de seleccion de pizzas.
  });

  test("Visualizacion de al menos 5 pizzas", async ({ page }) => {
    await page.goto("http://localhost:3000/menu");
    await expect(page.locator("div").filter({ hasText: "Our MenuDiscover our full" }).nth(1)).toBeVisible();    //  Verifica que en el menu      \\
    await expect(page.getByRole("main").locator("div").filter({ hasText: "Our PizzasAll" })).toBeVisible();     //  haya pizzas                   \\  
    await expect(page.getByText("All PizzasClassicSpecialtyVegetarianPremium")).toBeVisible();                  //  Verifica la existencia de variedades de pizzas
    await expect(page.locator("div").filter({ hasText: "classic50Margherita" }).nth(3)).toBeVisible();          //  Verifica Nombre de la pizza
    await expect(page.getByText("San Marzano tomatoes, fresh")).toBeVisible();                                  // < - Detecta si hay una descripcion de la pizza
    await expect(page.getByText("classic50Pepperoni RealeSpicy")).toBeVisible();                                //  Verifica Nombre de la pizza
    await expect(page.getByText("Spicy pepperoni, premium")).toBeVisible();                                     // < - Detecta si hay una descripcion de la pizza
    await expect(page.getByText("premium50Quattro")).toBeVisible();                                             //  Verifica Nombre de la pizza
    await expect(page.getByText("Mozzarella, gorgonzola,")).toBeVisible();                                      // < - Detecta si hay una descripcion de la pizza
    await expect(page.locator("div").filter({ hasText: "specialty50Diavola" }).nth(3)).toBeVisible();           //  Verifica Nombre de la pizza
    await expect(page.getByText("Spicy salami, calabrian chili")).toBeVisible();                                // < - Detecta si hay una descripcion de la pizza
    await expect(page.locator("div").filter({ hasText: "vegetarian50Giardino" }).nth(3)).toBeVisible();         //  Verifica Nombre de la pizza
    await expect(page.getByText("Grilled zucchini, bell")).toBeVisible();                                       // < - Detecta si hay una descripcion de la pizza
  });

  test("Pizza no disponible / Sin Stock", async ({ page }) => {
    await page.goto("http://localhost:3000/menu");
    await expect(page.locator("div").filter({ hasText: "Our MenuDiscover our full" }).nth(1)).toBeVisible();    // 
    await expect(page.getByRole("main").locator("div").filter({ hasText: "Our PizzasAll" })).toBeVisible();     // Verifica nuevamente el catalogo
    await expect(page.getByText('Hawaiian ParadiseHam,')).toBeVisible();                                        // Verifica que haya una pizza
    await expect(page.locator('div').filter({ hasText: /^\$15\.99$/ })).toBeVisible();                          // Verifica el costo
    await expect(page.locator('div').filter({ hasText: /^0$/ })).toBeVisible();                                 // Verifica el Stock
    await expect(page.getByText('Out of Stock')).toBeVisible();                                                 // Verifica la existencia de un mensaje de "Fuera de stock"
  });
});
