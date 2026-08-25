# Ejemplo de base de datos de componentes

La aplicación usa dos archivos relacionados:

- `FieldDefinitions.gs` define qué significa cada característica `C1`–`C15` y
  qué unidad se muestra en el encabezado.
- `Components.gs` contiene un registro por componente y sus valores reales.

## 1. Defina primero los encabezados

Ejemplo ilustrativo en `FieldDefinitions.gs`:

```javascript
characteristics: [
  { id: 'C1', label: 'Función', unit: '-' },
  { id: 'C2', label: 'Familia química', unit: '-' },
  { id: 'C3', label: 'Forma física', unit: '-' },
  { id: 'C4', label: 'Apariencia', unit: '-' },
  { id: 'C5', label: 'Materia activa', unit: '%' },
  { id: 'C6', label: 'pH', unit: '-' },
  { id: 'C7', label: 'Densidad', unit: 'g/mL' },
  { id: 'C8', label: 'Viscosidad', unit: 'cP' },
  { id: 'C9', label: 'Solubilidad', unit: '-' },
  { id: 'C10', label: 'Temperatura mínima', unit: '°C' },
  { id: 'C11', label: 'Temperatura máxima', unit: '°C' },
  { id: 'C12', label: 'Presentación', unit: '-' },
  { id: 'C13', label: 'Proveedor', unit: '-' },
  { id: 'C14', label: 'Estatus', unit: '-' },
  { id: 'C15', label: 'Observaciones', unit: '-' }
]
```

Estos nombres son solamente un ejemplo; deben reemplazarse por las 15
características reales del proceso.

## 2. Capture los componentes

Ejemplo ilustrativo en `Components.gs`:

```javascript
var COMPONENT_DATABASE = Object.freeze([
  {
    code: 'RM-0001',
    name: 'Purified Water',
    characteristics: {
      C1: 'Carrier / intermediate',
      C2: 'Water',
      C3: 'Liquid',
      C4: 'Clear and colorless',
      C5: 0,
      C6: 7.0,
      C7: 1.0,
      C8: 1,
      C9: 'Completely soluble',
      C10: 5,
      C11: 35,
      C12: 'Bulk',
      C13: 'Approved supplier A',
      C14: 'Active',
      C15: ''
    }
  },
  {
    code: 'RM-0002',
    name: 'Anionic Surfactant 26%',
    characteristics: {
      C1: 'Anionic surfactant',
      C2: 'Ether sulfate',
      C3: 'Viscous liquid',
      C4: 'Clear to pale yellow',
      C5: 26,
      C6: 7.5,
      C7: 1.05,
      C8: 850,
      C9: 'Water dispersible',
      C10: 15,
      C11: 40,
      C12: 'Bulk',
      C13: 'Approved supplier B',
      C14: 'Active',
      C15: 'Protect from freezing'
    }
  }
]);
```

## Reglas de la base

- `code` debe ser único y se utiliza como identificador interno.
- `name` es el texto que verá el usuario en el formulario.
- Todos los componentes deben contener las 15 claves, desde `C1` hasta `C15`.
- Los números deben escribirse como números, sin comillas: `26`, `7.5`, `850`.
- Los textos sí llevan comillas: `'Liquid'`, `'Active'`.
- Para un dato no aplicable puede utilizar `''`, que la interfaz mostrará como
  un guion.
- No agregue el símbolo de unidad al valor. La unidad se define una sola vez en
  `FieldDefinitions.gs`.
- El orden de las propiedades dentro de `characteristics` no cambia el orden de
  la tabla; este depende de `FieldDefinitions.gs`.
