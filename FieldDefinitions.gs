/**
 * Definición editable de los campos del formulario.
 *
 * Los IDs también son los marcadores de la plantilla para la sección A:
 * por ejemplo, el campo A_SHORT_1 se inserta usando {{A_SHORT_1}}.
 */
var FORM_SCHEMA = Object.freeze({
  sectionA: {
    title: 'A. Información general',
    description: 'Capture la información principal del caso.',
    fields: [
      {
        id: 'A_SHORT_1',
        label: 'Campo de respuesta corta',
        type: 'text',
        placeholder: 'Escriba una respuesta breve',
        required: true
      },
      {
        id: 'A_LONG_1',
        label: 'Campo de respuesta larga 1',
        type: 'textarea',
        placeholder: 'Describa la información requerida',
        required: true
      },
      {
        id: 'A_LONG_2',
        label: 'Campo de respuesta larga 2',
        type: 'textarea',
        placeholder: 'Agregue los detalles necesarios',
        required: true
      },
      {
        id: 'A_COMBO_1',
        label: 'Opción 1',
        type: 'select',
        options: ['Opción A', 'Opción B', 'Opción C'],
        required: true
      },
      {
        id: 'A_COMBO_2',
        label: 'Opción 2',
        type: 'select',
        options: ['Opción A', 'Opción B', 'Opción C'],
        required: true
      },
      {
        id: 'A_COMBO_3',
        label: 'Opción 3',
        type: 'select',
        options: ['Opción A', 'Opción B', 'Opción C'],
        required: true
      },
      {
        id: 'A_COMBO_4',
        label: 'Opción 4',
        type: 'select',
        options: ['Opción A', 'Opción B', 'Opción C'],
        required: true
      },
      {
        id: 'A_COMBO_5',
        label: 'Opción 5',
        type: 'select',
        options: ['Opción A', 'Opción B', 'Opción C'],
        required: true
      },
      {
        id: 'A_COMBO_6',
        label: 'Opción 6',
        type: 'select',
        options: ['Opción A', 'Opción B', 'Opción C'],
        required: true
      },
      {
        id: 'A_COMBO_7',
        label: 'Opción 7',
        type: 'select',
        options: ['Opción A', 'Opción B', 'Opción C'],
        required: true
      }
    ]
  },
  sectionB: {
    title: 'B. Componentes',
    description: 'Agregue los componentes y asigne un porcentaje. La suma debe ser 100%.'
  },
  sectionC: {
    title: 'C. Características de componentes',
    description: 'Las características se muestran automáticamente con base en los componentes seleccionados.',
    characteristics: [
      { id: 'C1', label: 'C1', unit: '-' },
      { id: 'C2', label: 'C2', unit: '-' },
      { id: 'C3', label: 'C3', unit: '-' },
      { id: 'C4', label: 'C4', unit: '-' },
      { id: 'C5', label: 'C5', unit: '-' },
      { id: 'C6', label: 'C6', unit: '-' },
      { id: 'C7', label: 'C7', unit: '-' },
      { id: 'C8', label: 'C8', unit: '-' },
      { id: 'C9', label: 'C9', unit: '-' },
      { id: 'C10', label: 'C10', unit: '-' },
      { id: 'C11', label: 'C11', unit: '-' },
      { id: 'C12', label: 'C12', unit: '-' },
      { id: 'C13', label: 'C13', unit: '-' },
      { id: 'C14', label: 'C14', unit: '-' },
      { id: 'C15', label: 'C15', unit: '-' }
    ]
  },
  sectionD: {
    title: 'D. Parámetros y límites',
    description: 'Capture los límites mínimo, objetivo y máximo.',
    fields: [
      { id: 'D1', label: 'Parámetro 1', unit: 'unidad' },
      { id: 'D2', label: 'Parámetro 2', unit: 'unidad' },
      { id: 'D3', label: 'Parámetro 3', unit: 'unidad' },
      { id: 'D4', label: 'Parámetro 4', unit: 'unidad' },
      { id: 'D5', label: 'Parámetro 5', unit: 'unidad' },
      { id: 'D6', label: 'Parámetro 6', unit: 'unidad' },
      { id: 'D7', label: 'Parámetro 7', unit: 'unidad' },
      { id: 'D8', label: 'Parámetro 8', unit: 'unidad' },
      { id: 'D9', label: 'Parámetro 9', unit: 'unidad' },
      { id: 'D10', label: 'Parámetro 10', unit: 'unidad' },
      { id: 'D11', label: 'Parámetro 11', unit: 'unidad' }
    ]
  }
});

function getFormSchema() {
  return JSON.parse(JSON.stringify(FORM_SCHEMA));
}
