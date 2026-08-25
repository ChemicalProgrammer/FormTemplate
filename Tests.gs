/**
 * Autoprueba estructural que no crea ni modifica archivos en Drive.
 * Ejecútela desde el editor de Apps Script antes de desplegar.
 * @return {Object}
 */
function runProjectSelfTest() {
  var errors = [];
  var sectionAFields = FORM_SCHEMA.sectionA.fields;
  var sectionCFields = FORM_SCHEMA.sectionC.characteristics;
  var sectionDFields = FORM_SCHEMA.sectionD.fields;

  assertTest_(sectionAFields.length === 10, 'A debe tener 10 campos en total.', errors);
  assertTest_(
    sectionAFields.filter(function(field) { return field.type === 'text'; }).length === 1,
    'A debe tener 1 respuesta corta.',
    errors
  );
  assertTest_(
    sectionAFields.filter(function(field) { return field.type === 'textarea'; }).length === 2,
    'A debe tener 2 respuestas largas.',
    errors
  );
  assertTest_(
    sectionAFields.filter(function(field) { return field.type === 'select'; }).length === 7,
    'A debe tener 7 comboboxes.',
    errors
  );
  assertTest_(sectionCFields.length === 15, 'C debe definir 15 características.', errors);
  assertTest_(sectionDFields.length === 11, 'D debe definir 11 parámetros.', errors);
  assertTest_(APP_CONFIG.numberedFolders.join(',') === '01,02,03,04', 'La estructura debe contener 01–04.', errors);
  validateTemplateMappingForTest_(errors);

  var componentCodes = {};
  COMPONENT_DATABASE.forEach(function(component) {
    assertTest_(!componentCodes[component.code], 'Código de componente repetido: ' + component.code, errors);
    componentCodes[component.code] = true;
    sectionCFields.forEach(function(characteristic) {
      assertTest_(
        Object.prototype.hasOwnProperty.call(component.characteristics, characteristic.id),
        component.code + ' no contiene ' + characteristic.id + '.',
        errors
      );
    });
  });

  var result = {
    ok: errors.length === 0,
    tests: {
      sectionAFields: sectionAFields.length,
      sectionCCharacteristics: sectionCFields.length,
      sectionDParameters: sectionDFields.length,
      numberedFolders: APP_CONFIG.numberedFolders.length,
      components: COMPONENT_DATABASE.length,
      mappedSectionAFields: Object.keys(SHEET_TEMPLATE_MAPPING.sectionA || {}).length,
      mappedSectionCCharacteristics: Object.keys(
        (SHEET_TEMPLATE_MAPPING.sectionC.columns || {}).characteristics || {}
      ).length,
      mappedSectionDFields: Object.keys(SHEET_TEMPLATE_MAPPING.sectionD || {}).length
    },
    errors: errors
  };

  console.log(JSON.stringify(result, null, 2));
  return result;
}

function validateTemplateMappingForTest_(errors) {
  var mapping = SHEET_TEMPLATE_MAPPING || {};
  assertMappedCellForTest_(mapping.general && mapping.general.caseName, 'general.caseName', errors);
  if (mapping.general && mapping.general.createdDate) {
    assertMappedCellForTest_(mapping.general.createdDate, 'general.createdDate', errors);
  }

  FORM_SCHEMA.sectionA.fields.forEach(function(field) {
    assertMappedCellForTest_(
      mapping.sectionA && mapping.sectionA[field.id],
      'sectionA.' + field.id,
      errors
    );
  });

  ['sectionB', 'sectionC'].forEach(function(sectionKey) {
    var dynamicMapping = mapping[sectionKey] || {};
    assertTest_(Boolean(dynamicMapping.sheet), sectionKey + '.sheet es obligatorio.', errors);
    assertTest_(isPositiveInteger_(dynamicMapping.startRow), sectionKey + '.startRow debe ser un entero positivo.', errors);
    assertTest_(isPositiveInteger_(dynamicMapping.maxRows), sectionKey + '.maxRows debe ser un entero positivo.', errors);
    ['code', 'name', 'percentage'].forEach(function(columnKey) {
      assertTest_(
        getColumnNumber_((dynamicMapping.columns || {})[columnKey]) > 0,
        sectionKey + '.columns.' + columnKey + ' no es una columna válida.',
        errors
      );
    });
  });

  FORM_SCHEMA.sectionC.characteristics.forEach(function(characteristic) {
    var characteristicColumns = (
      (mapping.sectionC || {}).columns || {}
    ).characteristics || {};
    assertTest_(
      getColumnNumber_(characteristicColumns[characteristic.id]) > 0,
      'sectionC.columns.characteristics.' + characteristic.id + ' no es una columna válida.',
      errors
    );
  });

  FORM_SCHEMA.sectionD.fields.forEach(function(field) {
    var fieldMapping = mapping.sectionD && mapping.sectionD[field.id];
    ['min', 'target', 'max'].forEach(function(kind) {
      assertMappedCellForTest_(
        fieldMapping && { sheet: fieldMapping.sheet, cell: fieldMapping[kind] },
        'sectionD.' + field.id + '.' + kind,
        errors
      );
    });
  });

  assertTest_(getColumnNumber_('A') === 1, 'La conversión de columna A falló.', errors);
  assertTest_(getColumnNumber_('AA') === 27, 'La conversión de columna AA falló.', errors);
}

function assertMappedCellForTest_(target, path, errors) {
  assertTest_(Boolean(target && target.sheet), path + ' debe indicar sheet.', errors);
  assertTest_(Boolean(target && isA1Cell_(target.cell)), path + ' debe indicar una celda A1 válida.', errors);
}

function assertTest_(condition, message, errors) {
  if (!condition) errors.push(message);
}
