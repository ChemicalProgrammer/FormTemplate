/**
 * Base de datos editable de componentes.
 *
 * Reemplace los ejemplos por los componentes reales. Cada componente debe
 * conservar un código único y 15 valores de características (C1 a C15).
 * Consulte COMPONENT_DATABASE_EXAMPLE.md para ver un ejemplo completo.
 */
var COMPONENT_DATABASE = Object.freeze([
  createExampleComponent_('COMP-001', 'Componente 1', 10),
  createExampleComponent_('COMP-002', 'Componente 2', 20),
  createExampleComponent_('COMP-003', 'Componente 3', 30),
  createExampleComponent_('COMP-004', 'Componente 4', 40),
  createExampleComponent_('COMP-005', 'Componente 5', 50),
  createExampleComponent_('COMP-006', 'Componente 6', 60)
]);

function createExampleComponent_(code, name, seed) {
  var characteristics = {};
  for (var index = 1; index <= 15; index += 1) {
    characteristics['C' + index] = seed + index;
  }
  return {
    code: code,
    name: name,
    characteristics: characteristics
  };
}

function getComponents() {
  return JSON.parse(JSON.stringify(COMPONENT_DATABASE));
}

function getComponentMap_() {
  return COMPONENT_DATABASE.reduce(function(map, component) {
    map[component.code] = component;
    return map;
  }, {});
}
