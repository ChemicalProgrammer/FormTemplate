# Preparar la plantilla de Google Sheets

La aplicación copia una hoja de cálculo nativa de Google Sheets y después
escribe los valores del formulario en la copia. No utiliza marcadores de texto.

## Archivo que controla las celdas

Edite `TemplateMapping.gs` dentro de Apps Script. Cada destino indica:

```javascript
{ sheet: 'Formulario', cell: 'B2' }
```

- `sheet`: nombre exacto de la pestaña de la plantilla.
- `cell`: celda en notación A1.

## Campos individuales

`general`, `sectionA` y `sectionD` se configuran celda por celda. Ejemplo:

```javascript
sectionD: {
  D1: { sheet: 'Formulario', min: 'B20', target: 'C20', max: 'D20' }
}
```

## Listas de componentes

Las secciones B y C pueden tener una cantidad variable de componentes. Se
configura una fila inicial y una columna por dato:

```javascript
sectionB: {
  sheet: 'Componentes',
  startRow: 3,
  maxRows: 50,
  percentageAsDecimal: true,
  columns: { code: 'A', name: 'B', percentage: 'C' }
}
```

El primer componente se escribe en la fila 3, el segundo en la 4 y así
sucesivamente. `maxRows` limita la capacidad reservada en la plantilla.

Cuando `percentageAsDecimal` es `true`, un valor capturado como 25 se escribe
como `0.25`. Deje las celdas de esa columna con formato de porcentaje en la
plantilla. Use `false` si necesita escribir el número 25.

## Reglas

- La plantilla debe ser un archivo nativo de Google Sheets.
- Los nombres de las pestañas deben coincidir exactamente con el mapa.
- Prepare de antemano estilos, formatos numéricos, fórmulas y celdas combinadas.
- Las celdas mapeadas deben ser editables y no estar protegidas para el usuario
  que ejecuta la aplicación.
- No coloque fórmulas en las celdas que recibirán valores del formulario; serán
  sustituidas en la copia.
