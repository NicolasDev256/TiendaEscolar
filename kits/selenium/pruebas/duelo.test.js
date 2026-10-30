const assert = require('node:assert/strict');
const { By, until, Key } = require('selenium-webdriver');
const { BASE_URL, crearDriver } = require('../soporte/driver');

/**
 * Selenium + Mocha · los tres criterios del duelo.
 *
 * CA1 viene RESUELTO: léanlo, ejecútenlo (npm test) y entiendan cada línea ANTES de escribir los otros dos.
 * Los otros dos están en `it.skip(...)`: cambien `it.skip` por `it` cuando empiecen a implementarlos.
 */
describe('Duelo · tres criterios de aceptación', function () {
  let driver;

  // Selenium no trae ejecutor: hay que abrir y cerrar el navegador a mano, en cada prueba.
  beforeEach(async () => {
    driver = await crearDriver();
  });
  afterEach(async () => {
    await driver.quit();
  });

  // ------------------------------------------------------------------ EJEMPLO RESUELTO
  it('US-01 CA1: el catálogo muestra 8 productos', async () => {
    await driver.get(BASE_URL);
    // Selenium no espera por ti: hay que esperar a mano a que existan los elementos.
    await driver.wait(until.elementLocated(By.css('h3')), 5000);

    const productos = await driver.findElements(By.css('h3'));
    assert.equal(productos.length, 8);
  });

  // ------------------------------------------------------------------ TU TURNO · US-04 CA2
  it('US-04 CA2: no deja agregar 7 mochilas de una vez (stock 6) y avisa', async () => {
    // Dado   un producto con stock 6 (la Mochila escolar),
    // Cuando intento agregar 7 unidades de una vez,
    // Entonces veo un aviso con el stock disponible y no se agrega nada.
    await driver.get(BASE_URL);
    const tarjeta = await driver.wait(
      until.elementLocated(
        By.xpath("//h3[normalize-space()='Mochila escolar']/ancestor::div[contains(@class,'rounded-lg')][1]")
      ),
      5000
    );

    // El campo ya trae un 1 y sendKeys escribe al final: se selecciona todo antes para que quede 7 y no 17.
    const cantidad = await tarjeta.findElement(By.css('input[type="number"]'));
    await cantidad.sendKeys(Key.chord(Key.CONTROL, 'a'), '7');
    // Con 17 la tienda da el MISMO aviso (también supera el stock): sin esta comprobación la prueba pasaría igual.
    assert.equal(await cantidad.getAttribute('value'), '7');
    await tarjeta.findElement(By.xpath(".//button[normalize-space()='Agregar']")).click();

    // El aviso es un alert() nativo: se espera, se lee y se acepta (el kit lo deja abierto, ver soporte/driver.js).
    await driver.wait(until.alertIsPresent(), 5000);
    const alerta = await driver.switchTo().alert();
    const aviso = await alerta.getText();
    await alerta.accept();
    assert.equal(aviso, 'Solo hay 6 unidades disponibles de Mochila escolar.');

    const vacio = await driver.findElements(By.xpath("//*[normalize-space(text())='Tu carrito está vacío.']"));
    assert.equal(vacio.length, 1, 'El carrito ya no dice «Tu carrito está vacío.»: se agregó algo');
  });

  // ------------------------------------------------------------------ TU TURNO · US-09 CA1
  it.skip('US-09 CA1: DESC10 descuenta el 10 % del subtotal', async () => {
    // Dado   un carrito con productos (1 Mochila escolar, $ 65.000),
    // Cuando aplico el código DESC10,
    // Entonces el descuento es el 10 % del subtotal: $ 6.500.
    //
    // Pistas:
    //  · Agregar la mochila: el botón «Agregar» de SU tarjeta (la cantidad por defecto es 1).
    //  · El campo del código se ubica por su placeholder: input[placeholder='Código de descuento'].
    //  · El valor está en la fila cuyo <dt> empieza por «Descuento»: su hermano <dd> (XPath: following-sibling::dd).
    //  · React dibuja esa fila DESPUÉS del clic en «Aplicar»: espérala con driver.wait(...) antes de leerla.
  });
});
