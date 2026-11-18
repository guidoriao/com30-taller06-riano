# Informe - Taller 06 COM30

## 1. Datos del estudiante
- Nombre y apellidos: Guido Riaño
- Código: 8_GSIN_G2


## 2. Escenario
**E2 - Requisición de compra** (mismo que el Taller 06, ampliado con búsqueda reactiva)

## 3. Tabla A · Semilla de datos (12 registros)

| Código | Solicitante | Área | Estado | Justificación (campos de búsqueda) |
|:------:|:------------|:-----|:-------|:-----------------------------------|
| R01 | Juan Pérez | Sistemas | Pendiente | Compra de equipos de cómputo para la oficina |
| R02 | María Gómez | Contabilidad | Aprobado | Sillas ergonómicas para área administrativa |
| R03 | Carlos Ruiz | Sistemas | Pendiente | Licencias de software antivirus anuales |
| R04 | Ana Torres | Recursos Humanos | Rechazado | Capacitación en normativa laboral |
| R05 | Luis Mendoza | Sistemas | Pendiente | Servidores de respaldo para base de datos |
| R06 | Elena Díaz | Mercadeo | Aprobado | Material promocional para feria universitaria |
| R07 | Pedro Jiménez | Sistemas | Pendiente | Cableado estructurado para nueva sede |
| R08 | Sofía Ramírez | Bienestar | Rechazado | Implementos deportivos para jornada recreativa |
| R09 | Andrés Castro | Sistemas | Pendiente | Monitores para área de soporte técnico |
| R10 | Valeria León | Contabilidad | Aprobado | Software de nómina anual |
| R11 | Diego Mora | Logística | Rechazado | Transporte para entrega de equipos |
| R12 | Lucía Méndez | Sistemas | Pendiente | UPS para servidores principales |

**Palabra que aparece en 2 o más registros:** "sistemas" (aparece en R01, R03, R05, R07, R09, R12)
**Palabra que no existe:** "xyzw"

## 4. Tabla B · Casos de prueba (9 casos mínimos)

| Caso | Acción | Resultado esperado | Obtenido|
|:----:|:-------|:-------------------|:------------------:|
| C1 | Escribir "sistemas" | 6 registros. Llamadas: 1 | |
| C2 | Cambiar a "sist" | 6 registros. Llamadas: 2 | |
| C3 | Cambiar a "equipos" | 2 registros (R01, R11). Llamadas: 3 | |
| C4 | Agregar espacio final: "equipos " | Mismos 2 registros. Llamadas: 3 (sin consulta nueva) | |
| C5 | Escribir "x" | Mensaje "Mínimo 2 caracteres". Sin consulta | |
| C6 | Escribir "zzz" | Mensaje "Sin coincidencias". Llamadas: 4 | |
| C7 | Escribir "sistemas" y aplicar cada filtro de estado | Llamadas: 5. El filtro no suma llamadas | |
| C8 | Escribir "servidor" letra por letra, sin pausas | 1 registro (R05). Llamadas: 6 (una consulta) | |
| C9 | Borrar. Escribir "ant", esperar 400 ms y completar "antivirus" en < 300 ms | Termina con 1 registro (R03). Sin `switchMap` terminaría con respuesta de "ant" | |

> **Instrucción:** Escriba el resultado esperado ANTES de ejecutar. Luego ejecute cada caso, anote lo obtenido y tome la captura de pantalla correspondiente. Pegue la captura de la tabla tras el caso C9.

## 5. Requerimientos cumplidos (R1 - R8)

| Req. | Descripción | ¿Cumplido? |
|:----:|:------------|:----------:|
| R1 | `buscar(texto)` devuelve Observable con retardo y signal `llamadas` de solo lectura | Sí |
| R2 | `valueChanges` con `map(trim)`, `debounceTime(300)`, `distinctUntilChanged` | Sí |
| R3 | `switchMap` hacia el servicio; `of([])` bajo 2 caracteres; solo respuesta de última consulta | Sí |
| R4 | Resultado con `toSignal` y valor inicial; `computed` con total y conteo por estado | Sí |
| R5 | Filtro por estado con signal y `computed`; no genera consultas | Sí |
| R6 | Historial de 5 consultas con `takeUntilDestroyed` | Sí |
| R7 | Mensajes: "Mínimo 2 caracteres", "Buscando…", "Sin coincidencias" (`@empty`) | Sí |
| R8 | Repositorio con 4+ commits T07, README, informe PDF, enlace privado | Sí |


## 7. Sustentación y fuentes

### ¿Por qué `Validators.required` acepta una cadena formada solo por espacios?
`Validators.required` solo verifica que el valor del control no sea `null`, `undefined` ni una cadena vacía `""`. Una cadena compuesta únicamente por espacios en blanco (por ejemplo, `"   "`) tiene una longitud mayor a cero, por lo que Angular la considera un valor válido y no dispara el error de `required`.

### ¿Cómo se resolvió en la aplicación?
Se creó un validador propio `noSoloEspaciosValidator()` que usa una expresión regular (`/^\s*$/`) para detectar si el valor consiste únicamente de espacios en blanco. Si es así, devuelve `{ soloEspacios: true }`, haciendo que el control sea inválido. Este validador se aplicó junto a `required` en los campos de texto.

### Fuentes y ayudas utilizadas

| Fuente / Ayuda | Qué se tomó y qué se adaptó |
|:---------------|:----------------------------|
| Documentación oficial de Angular (angular.io) | Standalone Components, Signals, Reactive Forms, RxJS (`switchMap`, `debounceTime`, `distinctUntilChanged`, `map`), `toSignal`, `takeUntilDestroyed`, sintaxis `@if`, `@for`, `@defer`. |
| Documentación de Tailwind CSS | Clases de utilidad para diseño responsivo, formularios, tablas, estados de carga y alertas. |
| Sesiones S05, S06, S07 y S08 del curso COM30 | Servicio con estado en signals, formularios reactivos, validadores propios, FormArray, búsqueda reactiva con RxJS. |
| MDN Web Docs | Expresiones regulares (`RegExp`) y manipulación inmutable de arrays. |
| Ejemplos de clase (repositorio `/s08`, ejemplos 4, 5 y 8) | Técnica de tubería de búsqueda con `valueChanges` y `switchMap`. Adaptada al escenario de Requisición de compra (no se copió el inventario de productos de la clase). |
| GitHub Docs | Creación de repositorio público, ramas y commits para la entrega. |