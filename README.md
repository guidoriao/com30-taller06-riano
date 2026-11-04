# COM30 - Taller 06: Requisición de Compra

## Estudiante
- Nombre y apellidos: Guido Riaño
- Código: 8_GSIN_G2

## Escenario
**E2 - Requisición de compra** (Tabla 1 del taller)

Campos de cabecera:
- Solicitante
- Área
- Fecha de solicitud
- Fecha requerida
- Justificación
- Prioridad

Regla de grupo: La fecha requerida debe ser posterior a la fecha de solicitud.

Ítems (FormArray dinámico):
- Artículos: descripción, cantidad, valor unitario

## Justificación de la estructura
Se eligió una estructura modular separada por capas (modelo, validadores, servicio, componentes) porque:
- Facilita el mantenimiento y la prueba unitaria de cada responsabilidad.
- Permite reutilizar el servicio (`RequisicionService`) desde cualquier componente standalone.
- Los validadores personalizados están isolados en `src/app/validators/` para poder aplicarlos en otros formularios si fuese necesario.

## Tipo de formulario
**Formulario reactivo** con `FormBuilder.nonNullable`, `FormGroup`, `FormArray` y validadores reactivos. No se usa `ngModel` ni `FormsModel` de manera implicita en los controles.

## Cómo ejecutar (desarrollo)
Requisitos: Node.js y Angular CLI instalados.

Desde la terminal de VS Code, ubicada en la carpeta del proyecto:

```powershell
npm install
ng serve
```

Luego abrir el navegador en: `http://localhost:4200/`

## Cómo ejecutar (producción)
```powershell
npm install
ng build
```
Los archivos generados quedan en `dist/taller06/`.

## Casos de prueba definidos (según Tabla 2 del taller)

| Caso | Entrada | Resultado esperado |
|------|---------|-------------------|
| C1 | Solicitante "Juan Pérez", Área "Compras", fecha solicitud 01/11/2026, fecha requerida 02/11/2026, justificación válida, prioridad "Alta", 1 artículo válido | Válido: se agrega y el listado muestra 1 registro |
| C2 | Fecha requerida igual a fecha solicitud | Inválido: error de grupo "rangoFechasInvalido" mostrado en el formulario |
| C3 | Fecha requerida un día posterior a solicitud | Válido: el error de grupo desaparece |
| C4 | Solicitante con solo espacios "   " | Inválido: `required` lo acepta; el validador propio `noSoloEspacios` lo rechaza |
| C5 | Lista de artículos con 0 filas | Inválido: `sinArticulos` mostrado; no permite enviar |
| C6 | Lista de artículos con 1 fila válida | Válido: se permite enviar |
| C7 | Cantidad 0 en un artículo | Inválido: `Validators.min(1)` lo rechaza |
| C8 | Cantidad 1 en un artículo | Válido: aceptado |

## Tecnologías
- Angular 18+ (Standalone Components, Signals, Reactive Forms)
- Tailwind CSS
- TypeScript
- Zone.js
- Sin NgModule, sin *ngIf, sin rutas, sin HttpClient (datos en memoria)
