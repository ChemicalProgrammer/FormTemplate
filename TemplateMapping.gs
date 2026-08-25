/**
 * MAPA EDITABLE DE LA PLANTILLA DE GOOGLE SHEETS
 *
 * Este es el único archivo que necesita editar para indicar dónde se escribe
 * cada dato del formulario. Los nombres de las hojas deben coincidir
 * exactamente con los de la plantilla y las celdas usan notación A1.
 *
 * Las secciones B y C aceptan n componentes: cada componente ocupa una fila a
 * partir de startRow. En "columns" puede usar letras ("A", "B", "AA") o
 * números de columna (1, 2, 27).
 *
 * Si percentageAsDecimal es true, 25% se escribe como 0.25, que es la forma
 * apropiada cuando la celda de la plantilla tiene formato de porcentaje.
 */
var SHEET_TEMPLATE_MAPPING = Object.freeze({
  general: {
    caseName: { sheet: 'Formulario', cell: 'B2' },
    createdDate: { sheet: 'Formulario', cell: 'B3' }
  },

  sectionA: {
    A_SHORT_1: { sheet: 'Formulario', cell: 'B5' },
    A_LONG_1: { sheet: 'Formulario', cell: 'B6' },
    A_LONG_2: { sheet: 'Formulario', cell: 'B7' },
    A_COMBO_1: { sheet: 'Formulario', cell: 'B9' },
    A_COMBO_2: { sheet: 'Formulario', cell: 'B10' },
    A_COMBO_3: { sheet: 'Formulario', cell: 'B11' },
    A_COMBO_4: { sheet: 'Formulario', cell: 'B12' },
    A_COMBO_5: { sheet: 'Formulario', cell: 'B13' },
    A_COMBO_6: { sheet: 'Formulario', cell: 'B14' },
    A_COMBO_7: { sheet: 'Formulario', cell: 'B15' }
  },

  sectionB: {
    sheet: 'Componentes',
    startRow: 3,
    maxRows: 50,
    percentageAsDecimal: true,
    columns: {
      code: 'A',
      name: 'B',
      percentage: 'C'
    }
  },

  sectionC: {
    sheet: 'Caracteristicas',
    startRow: 3,
    maxRows: 50,
    percentageAsDecimal: true,
    columns: {
      code: 'A',
      name: 'B',
      percentage: 'C',
      characteristics: {
        C1: 'D',
        C2: 'E',
        C3: 'F',
        C4: 'G',
        C5: 'H',
        C6: 'I',
        C7: 'J',
        C8: 'K',
        C9: 'L',
        C10: 'M',
        C11: 'N',
        C12: 'O',
        C13: 'P',
        C14: 'Q',
        C15: 'R'
      }
    }
  },

  sectionD: {
    D1: { sheet: 'Formulario', min: 'B20', target: 'C20', max: 'D20' },
    D2: { sheet: 'Formulario', min: 'B21', target: 'C21', max: 'D21' },
    D3: { sheet: 'Formulario', min: 'B22', target: 'C22', max: 'D22' },
    D4: { sheet: 'Formulario', min: 'B23', target: 'C23', max: 'D23' },
    D5: { sheet: 'Formulario', min: 'B24', target: 'C24', max: 'D24' },
    D6: { sheet: 'Formulario', min: 'B25', target: 'C25', max: 'D25' },
    D7: { sheet: 'Formulario', min: 'B26', target: 'C26', max: 'D26' },
    D8: { sheet: 'Formulario', min: 'B27', target: 'C27', max: 'D27' },
    D9: { sheet: 'Formulario', min: 'B28', target: 'C28', max: 'D28' },
    D10: { sheet: 'Formulario', min: 'B29', target: 'C29', max: 'D29' },
    D11: { sheet: 'Formulario', min: 'B30', target: 'C30', max: 'D30' }
  }
});

function getTemplateMapping() {
  return JSON.parse(JSON.stringify(SHEET_TEMPLATE_MAPPING));
}
