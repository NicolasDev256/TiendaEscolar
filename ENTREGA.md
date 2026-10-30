# Entrega · Duelo de herramientas

**Equipo:** Nicolas Giraldo Chica (trabajo individual)  
**Integrantes:** Nicolas Giraldo Chica  
**Repositorio:** https://github.com/NicolasDev256/TiendaEscolar  
**Herramienta que nos tocó:** ☑ Selenium + Mocha &nbsp; ☐ Cypress &nbsp; ☐ Playwright + Cucumber  
**Escenario que nos tocó:** E4 · Agencia Pixel

> Completa este archivo a medida que avanzas (cada sección dice en qué parte de la guía se llena).
> Lo que se mide con números lo guarda el medidor en `medidas.json`; aquí va lo que un número no dice.
> Escribe con tus palabras: las respuestas copiadas de la guía, de otro equipo o de un asistente sin pasar por tu criterio no cuentan.

Archivos que entregan, todos en el repositorio y con `git push`:

| Archivo | Quién lo escribe | Parte |
|---|---|---|
| `ENTREGA.md` (este) | ustedes | 1 a 6 |
| `autoinforme.json` | ustedes (minutos y diagnóstico) | 2 a 4 |
| `medidas.json` y `medidas-control.json` | los genera el medidor (`npm run medir`) | 4 |
| `MATRIZ.md` | ustedes | 5 |
| `ADR.md` | ustedes | 6 |
| Las pruebas de su kit (las tres historias) | ustedes | 1 a 3 |

---

## 1. Qué hace la herramienta por nosotros (Parte 1)

Lean el ejemplo resuelto (US-01 CA1) en su kit, **línea por línea**, y los archivos de `soporte` o de configuración
que vienen con él. Para cada tarea que alguien debe cumplir en una prueba de interfaz, digan **quién la hace**:
*la herramienta sola*, *una librería que hubo que sumar* (¿cuál?) o *código nuestro*. Escriban el archivo y la línea.

| Tarea | ¿Quién la hace? | ¿Dónde lo vemos? (archivo y línea) |
|---|---|---|
| Abrir el navegador y cerrarlo al terminar | **Código nuestro.** Selenium sabe abrir Chrome (`new Builder()…build()`) y cerrarlo (`driver.quit()`), pero somos nosotros quienes lo llamamos antes y después de cada prueba con los *hooks* de Mocha. El *chromedriver* lo baja Selenium Manager solo | `kits/selenium/soporte/driver.js:9-17` (crear) · `kits/selenium/pruebas/duelo.test.js:15-20` (`beforeEach` / `afterEach`) |
| Esperar a que el elemento exista o se pueda usar | **Código nuestro.** Selenium trae la herramienta (`driver.wait` + `until`), pero no espera si no se lo pedimos: hay que escribir cada espera con su tiempo límite. `findElements` de la línea 28 no espera nada; funciona porque la línea 26 ya esperó | `kits/selenium/pruebas/duelo.test.js:26` |
| Reintentar una comprobación que todavía no se cumple | **Nadie.** `assert.equal` comprueba una sola vez: si en ese instante hay 7 tarjetas, falla. Mocha podría repetir la prueba entera (`retries`), pero el kit no lo configura | `kits/selenium/pruebas/duelo.test.js:29` · `kits/selenium/.mocharc.json` (sin `retries`) |
| Ejecutar las pruebas, contarlas y decir cuántas pasaron | **Librería sumada: Mocha.** Encuentra los archivos, corre los `it`, salta los `it.skip` y escribe «1 passing / 2 pending» | `kits/selenium/package.json:10` (`mocha`) · `kits/selenium/.mocharc.json:2` (`spec`) |
| Comprobar un valor y mostrar «esperado» y «recibido» | **Librería sumada: `assert` de Node** (`node:assert/strict`, viene con Node, no es de Selenium). Al fallar lanza un `AssertionError` con *expected* y *actual*, y Mocha lo imprime como diferencia | `kits/selenium/pruebas/duelo.test.js:1` y `:29` |
| Leer el texto de un `alert()` del navegador *(lo descubren en la Parte 2)* | **Selenium + configuración del kit.** Selenium lo lee (`until.alertIsPresent()`, `switchTo().alert().getText()`, `accept()`), pero solo porque el kit pide a ChromeDriver no cerrarlo solo (`unhandledPromptBehavior: 'ignore'`) | `kits/selenium/soporte/driver.js:14-16` · pista en `kits/selenium/pruebas/duelo.test.js:43` |
| Dejar evidencia (captura, video o traza) cuando una prueba falla | **Nadie.** Ni Selenium ni Mocha guardan captura, video ni traza por su cuenta. Selenium tiene `driver.takeScreenshot()`, pero habría que llamarlo nosotros en un `afterEach` cuando la prueba falla | Ningún archivo del kit lo hace (`duelo.test.js:18-20` solo cierra el navegador) |

**Con esta tabla:** ¿la herramienta que nos tocó es una *librería*, un *framework*, o una librería con piezas que
tuvimos que armar nosotros? Respondan en dos frases con la idea «la librería la llamas tú; el framework te llama a ti».

> _Respuesta:_ Selenium es una **librería con piezas armadas**: nosotros la llamamos para abrir el navegador, esperar,
> buscar y cerrar, y ella no hace nada que no le pidamos. Quien nos llama a nosotros es Mocha (el ejecutor que sumamos),
> y las aserciones vienen de Node: de las siete tareas, dos son código nuestro, dos las ponen piezas sumadas y dos no las cubre nadie.

## 2. Bitácora de las historias (Partes 2 y 3)

Una columna por historia. «Minutos» son los mismos que anotan en `autoinforme.json`: desde que empiezan a escribir
hasta que ven la prueba en verde.

| | US-04 CA2 (7 mochilas, stock 6) | US-09 CA1 (DESC10) |
|---|---|---|
| Minutos hasta el verde | ≈ 5 (estimado; código generado con IA, ver `usoDeIA`) | ≈ 5 (estimado; código generado con IA, ver `usoDeIA`) |
| Primer intento que **no** funcionó: qué escribimos y qué dijo la herramienta | La primera versión pasaba en verde, pero **también pasaba sin seleccionar el campo** (sin `Key.chord(Key.CONTROL, 'a')`): con 17 (o 71) la tienda da el mismo aviso «Solo hay 6 unidades…» y no agrega nada. La herramienta no dijo nada porque no había error: la prueba no distinguía 7 de 17. Lo arreglamos comprobando el valor del campo antes del clic (`duelo.test.js:49`) | La pista decía que React dibuja la fila «Descuento» después del clic, y el primer intento esperaba la fila que **empieza** por «Descuento». Pero esa fila ya existe desde que hay algo en el carrito («Descuento (0%)», «− $ 0»): la espera se cumpliría al instante y podría leer el 0 de antes. Lo vimos en el código de la tienda antes de correrla y la cambiamos para esperar la fila «Descuento (10%)» (`duelo.test.js:83-86`) |
| Mensaje de error que nos ayudó (o que nos confundió) | Al probar sin seleccionar: `'71' !== '7'` en `duelo.test.js:49`. Ayudó y sorprendió: esperábamos 17, pero en Chrome sin ventana el cursor quedó **al inicio** del campo y el 7 se escribió delante del 1 | Al cambiar el esperado a 6600: `La fila «Descuento» dice «− $ 6.500»` y `'6500' !== '6600'` en `duelo.test.js:89`. Ayudó porque el mensaje propio muestra el texto tal como sale en pantalla, no solo los dígitos que comparamos |
| Qué tuvimos que buscar en la documentación (enlace) | Cómo esperar, leer y aceptar un `alert()`: https://www.selenium.dev/documentation/webdriver/interactions/alerts/ | Esperas explícitas con `driver.wait` y `until`: https://www.selenium.dev/documentation/webdriver/waits/ |
| Qué haría distinto un equipo con más experiencia en esta herramienta | Escribiría un ayudante propio que seleccione, escriba y compruebe el valor de un campo, y guardaría los selectores XPath de la tarjeta en una función reutilizable (US-09 CA1 vuelve a buscar la misma tarjeta) | Guardaría en `soporte/` funciones como `tarjetaDe(nombre)` y `valorDeFila(etiqueta)`, y compararía el dinero con una función que entienda el formato `es-CO` en lugar de quitar todo lo que no sea dígito |

**Lo más distinto frente a US-01 CA1** (el ejemplo resuelto): ¿qué cambió al leer un `alert()`, al elegir *dentro de
una tarjeta* y al leer un valor del carrito? Piensen en esperas, selectores y en cómo leyeron el resultado.

> _Respuesta:_ En US-01 CA1 bastaba una espera y contar `<h3>`. Aquí hubo que **elegir dentro de una tarjeta**: un
> XPath que sube del `<h3>` «Mochila escolar» a su `div.rounded-lg` y desde ahí busca el campo y el botón, porque las
> ocho tarjetas tienen un «Agregar» igual. El **`alert()`** no es parte de la página: hay que esperarlo con
> `until.alertIsPresent()`, cambiar a él, leerlo y aceptarlo, y solo funciona porque el kit le dice a ChromeDriver que no
> lo cierre. Y al **leer el carrito** la espera tuvo que ser por el *valor* («Descuento (10%)»), no solo por que el
> elemento exista: en US-01 el elemento aparecía una vez; aquí ya estaba y cambia después del clic. Además, el dinero
> viene formateado («− $ 6.500»), así que comparamos los dígitos.

## 3. Lo que medimos (Parte 4)

Pega el resumen que imprimió `npm run medir` en tu kit y en el control (Playwright Test):

```text
Midiendo: Selenium + Mocha · 10 corridas · carpeta kits\selenium

  corrida 1/10   32.9 s   ✓ pasan las 3
  corrida 2/10   24.1 s   ✓ pasan las 3
  corrida 3/10   16.1 s   ✓ pasan las 3
  corrida 4/10   14.1 s   ✓ pasan las 3
  corrida 5/10    9.9 s   ✓ pasan las 3
  corrida 6/10   11.5 s   ✓ pasan las 3
  corrida 7/10    8.9 s   ✓ pasan las 3
  corrida 8/10    7.7 s   ✓ pasan las 3
  corrida 9/10    8.3 s   ✓ pasan las 3
  corrida 10/10    7.6 s   ✓ pasan las 3

Resumen
  Velocidad ......... mediana 10.68 s  (mínimo 7.62 · máximo 32.93)
  Estabilidad ....... 10 de 10 corridas completas
  Código ............ 57 líneas de pruebas + 16 de soporte = 73
  selenium-webdriver. 4.51.0 instalada · última publicación hace 1 días (v4.52.0)
  mocha.............. 12.0.3 instalada · última publicación hace 29 días (v12.0.3)
  Autoinforme ....... minutos {"instalacion":2,"ca2":null,"ca3":null}, diagnóstico 2/5
```

```text
Midiendo: Playwright Test (control) · 10 corridas · carpeta control\playwright

  corrida 1/10   12.6 s   ✓ pasan las 3
  corrida 2/10   12.4 s   ✓ pasan las 3
  corrida 3/10   11.1 s   ✓ pasan las 3
  corrida 4/10    8.8 s   ✓ pasan las 3
  corrida 5/10    7.7 s   ✓ pasan las 3
  corrida 6/10    6.5 s   ✓ pasan las 3
  corrida 7/10    6.6 s   ✓ pasan las 3
  corrida 8/10    6.1 s   ✓ pasan las 3
  corrida 9/10    7.9 s   ✓ pasan las 3
  corrida 10/10    7.1 s   ✓ pasan las 3

Resumen
  Velocidad ......... mediana 7.81 s  (mínimo 6.15 · máximo 12.55)
  Estabilidad ....... 10 de 10 corridas completas
  Código ............ 34 líneas de pruebas + 14 de soporte = 48
  @playwright/test... 1.64.1 instalada · última publicación hace 16 días (v1.64.1)
```

- Mediana de nuestro kit: **10.68** s · Mediana del control en **nuestra** máquina: **7.81** s · **Veces el control** (kit ÷ control): **1.37**
- Corridas completas de nuestro kit: **10** de **10**
- Líneas de código (pruebas + soporte): **73** (57 + 16; el control usa 48)
- Puntos de diagnóstico (de 5): **2**

**El fallo a propósito.** ¿Qué rompieron y cómo? Pega las primeras 10 líneas de lo que dijo la herramienta y señala
qué ayudaba a encontrar la causa y qué faltaba.

Rompimos US-01 CA1 cambiando el 8 por un 9 en `duelo.test.js:29` (`assert.equal(productos.length, 9)`):

```text
  1) Duelo · tres criterios de aceptación
       US-01 CA1: el catálogo muestra 8 productos:

      AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

8 !== 9

      + expected - actual

      -8
      +9
      at Context.<anonymous> (pruebas\duelo.test.js:29:12)
```

**Qué ayudaba:** el nombre de la prueba, los valores `8` y `9`, y la línea 29. **Qué faltaba:** el mensaje no dice
*qué* se contaba (los `<h3>` del catálogo), y no quedó ninguna captura de la página para ver si había 8 tarjetas o algo
distinto. Hubo que abrir la línea 29 para entenderlo.

**Las cinco preguntas del diagnóstico** (se contestan **con el kit tal como llegó**, y el «sí» o «no» va en `autoinforme.json`).
En la última columna digan *de dónde vino* cada evidencia: de la **herramienta** (sola), de la **configuración del kit** o de
**código nuestro**.

| Pregunta (campo en `autoinforme.json`) | ¿Sí o no? | ¿De dónde vino? |
|---|:---:|---|
| ¿El mensaje dice **qué** falló (el elemento o la comprobación), sin que haya que adivinar? (`diceQueFallo`) | No | Solo dice «8 !== 9». El nombre de la prueba lo pone Mocha (librería sumada), pero nada nombra el elemento; el control de Playwright sí dice qué localizador contaba |
| ¿Muestra el valor **esperado** y el **recibido**? (`esperadoYRecibido`) | Sí | Del `assert` de Node y del diff de Mocha: piezas sumadas, no de Selenium |
| ¿Señala la **línea de nuestra prueba** donde falló? (`lineaDeLaPrueba`) | Sí | De la pila de errores de Node, que Mocha imprime: `pruebas\duelo.test.js:29:12` |
| ¿Quedó una **captura de pantalla** (o un video) de la falla en el disco? (`capturaOVideo`) | No | Nadie la guarda: ni Selenium, ni Mocha, ni la configuración del kit. Habría que escribir un `afterEach` con `driver.takeScreenshot()` |
| ¿Quedó una **traza o un informe** para repasar la falla paso a paso sin volver a correrla? (`trazaOInforme`) | No | Nadie: Mocha solo escribe en la consola y no quedó ningún archivo nuevo en el disco |

**Tres cosas que nuestra medición NO demuestra** (pistas: cuántas pruebas, cuántas corridas, cuántas máquinas,
qué mide el tiempo, qué cuenta una «línea de código»):

1. **Que escale.** Son 3 pruebas cortas sobre una tienda local. Con 300 pruebas pesarían cosas que aquí no aparecen:
   ejecutar en paralelo, el mantenimiento de los XPath y las esperas escritas a mano.
2. **Que el tiempo sea solo de la herramienta.** Cada corrida mide `npm test` completo (arrancar Node, la tienda y Chrome),
   en un solo computador. Además, las primeras corridas fueron mucho más lentas (32.9 s frente a unos 8 s al final) porque
   el equipo acababa de encenderse: con 10 corridas la mediana todavía arrastra ese calentamiento.
3. **Que menos líneas sea menos trabajo.** Las 73 líneas cuentan código, no dificultad: no miden cuánto costó encontrar
   un selector ni la prueba de 17/71 que pasaba sin comprobar nada. Tampoco miden otros navegadores (solo Chrome) ni
   otras máquinas.

## 4. Mirando el tablero (Parte 5)

Abran el tablero de la clase (el enlace lo da el docente) y respondan **con datos del tablero**, no con opiniones:

1. ¿Qué herramienta fue más rápida, medida en «veces el control»? ¿Y la más estable? ¿Hubo diferencias grandes **dentro** de una misma herramienta entre equipos? ¿A qué lo atribuyen?
2. ¿Qué herramienta dejó mejor diagnóstico y qué parte vino «de fábrica» o la tuvo que armar el equipo?
3. Un dato del tablero que les pareció raro. ¿Qué preguntarían a ese equipo antes de usarlo como evidencia?

> _Respuestas:_

## 5. Matriz y decisión (Partes 5 y 6)

☐ `MATRIZ.md` completa (pesos que suman 100, puntajes con evidencia, total y prueba de sensibilidad)  
☐ `ADR.md` completo (una página, con consecuencias negativas y qué nos haría cambiar de opinión)  
☐ `medidas.json`, `medidas-control.json` y `autoinforme.json` en el repositorio, con `git push`

**Nuestra recomendación en una frase:**

> _…_

## 6. Reflexión

1. Antes de medir, ¿qué herramienta habríamos recomendado? ¿Cambió algo después de ver los datos de **todas** las herramientas? Si la que recomendamos no es la que nos tocó, ¿por qué? Si lo es, ¿qué habría pasado si nos hubiera tocado otra?
2. ¿Qué evidencia nos hizo falta y no pudimos medir en esta actividad (por ejemplo: 300 pruebas en lugar de 3, otros navegadores, un mes de mantenimiento)?
3. En una automatización real, ¿qué parte del esfuerzo creen que es **escribir** las primeras pruebas y qué parte es **mantenerlas**? ¿Qué parte de esto no capta nuestra actividad?
4. Si el cliente fuera la empresa donde quieren trabajar, ¿qué pesos cambiarían en la matriz?
5. Si usaron un asistente de IA: ¿en qué momentos ayudó y en cuáles hubo que corregirlo? ¿Cómo cambia eso lo que significan los minutos de `autoinforme.json`?
