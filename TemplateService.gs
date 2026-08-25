/**
 * Copia una plantilla de Google Sheets y escribe el formulario de acuerdo con
 * SHEET_TEMPLATE_MAPPING, definido en TemplateMapping.gs.
 * @param {string} templateSpreadsheetId
 * @param {GoogleAppsScript.Drive.Folder} outputFolder
 * @param {Object} data
 * @return {GoogleAppsScript.Drive.File}
 */
function createSpreadsheetFromTemplate_(templateSpreadsheetId, outputFolder, data) {
  var template = DriveApp.getFileById(templateSpreadsheetId);
  var outputName = data.caseName + APP_CONFIG.generatedFileSuffix;
  var copy = template.makeCopy(outputName, outputFolder);
  var spreadsheet = SpreadsheetApp.openById(copy.getId());

  writeMappedCell_(
    spreadsheet,
    SHEET_TEMPLATE_MAPPING.general.caseName,
    asSafeSheetText_(data.caseName),
    'general.caseName'
  );

  if (SHEET_TEMPLATE_MAPPING.general.createdDate) {
    writeMappedCell_(
      spreadsheet,
      SHEET_TEMPLATE_MAPPING.general.createdDate,
      new Date(),
      'general.createdDate'
    );
  }

  FORM_SCHEMA.sectionA.fields.forEach(function(field) {
    writeMappedCell_(
      spreadsheet,
      SHEET_TEMPLATE_MAPPING.sectionA[field.id],
      asSafeSheetText_(data.sectionA[field.id]),
      'sectionA.' + field.id
    );
  });

  writeSectionB_(spreadsheet, data.components);
  writeSectionC_(spreadsheet, data.components);
  writeSectionD_(spreadsheet, data.sectionD);
  SpreadsheetApp.flush();
  return copy;
}

function writeSectionB_(spreadsheet, components) {
  var mapping = SHEET_TEMPLATE_MAPPING.sectionB;
  assertRowCapacity_(components.length, mapping, 'B');
  if (!components.length) return;

  var sheet = getMappedSheet_(spreadsheet, mapping.sheet, 'sectionB.sheet');
  writeColumnValues_(sheet, mapping.startRow, mapping.columns.code, components.map(function(item) {
    return asSafeSheetText_(item.code);
  }), 'sectionB.columns.code');
  writeColumnValues_(sheet, mapping.startRow, mapping.columns.name, components.map(function(item) {
    return asSafeSheetText_(item.name);
  }), 'sectionB.columns.name');
  writeColumnValues_(sheet, mapping.startRow, mapping.columns.percentage, components.map(function(item) {
    return mappedPercentage_(item.percentage, mapping.percentageAsDecimal);
  }), 'sectionB.columns.percentage');
}

function writeSectionC_(spreadsheet, components) {
  var mapping = SHEET_TEMPLATE_MAPPING.sectionC;
  assertRowCapacity_(components.length, mapping, 'C');
  if (!components.length) return;

  var sheet = getMappedSheet_(spreadsheet, mapping.sheet, 'sectionC.sheet');
  writeColumnValues_(sheet, mapping.startRow, mapping.columns.code, components.map(function(item) {
    return asSafeSheetText_(item.code);
  }), 'sectionC.columns.code');
  writeColumnValues_(sheet, mapping.startRow, mapping.columns.name, components.map(function(item) {
    return asSafeSheetText_(item.name);
  }), 'sectionC.columns.name');

  if (mapping.columns.percentage) {
    writeColumnValues_(sheet, mapping.startRow, mapping.columns.percentage, components.map(function(item) {
      return mappedPercentage_(item.percentage, mapping.percentageAsDecimal);
    }), 'sectionC.columns.percentage');
  }

  FORM_SCHEMA.sectionC.characteristics.forEach(function(characteristic) {
    writeColumnValues_(
      sheet,
      mapping.startRow,
      mapping.columns.characteristics[characteristic.id],
      components.map(function(item) {
        return normalizeMappedValue_(item.characteristics[characteristic.id]);
      }),
      'sectionC.columns.characteristics.' + characteristic.id
    );
  });
}

function writeSectionD_(spreadsheet, answers) {
  FORM_SCHEMA.sectionD.fields.forEach(function(field) {
    var mapping = SHEET_TEMPLATE_MAPPING.sectionD[field.id];
    var values = answers[field.id];
    ['min', 'target', 'max'].forEach(function(kind) {
      writeMappedCell_(
        spreadsheet,
        { sheet: mapping.sheet, cell: mapping[kind] },
        values[kind],
        'sectionD.' + field.id + '.' + kind
      );
    });
  });
}

function writeMappedCell_(spreadsheet, target, value, mappingPath) {
  if (!target || !target.sheet || !isA1Cell_(target.cell)) {
    throw new Error('El mapeo “' + mappingPath + '” no tiene una hoja/celda válida.');
  }
  var sheet = getMappedSheet_(spreadsheet, target.sheet, mappingPath);
  sheet.getRange(target.cell).setValue(normalizeMappedValue_(value));
}

function writeColumnValues_(sheet, startRow, column, values, mappingPath) {
  var columnNumber = getColumnNumber_(column);
  if (!columnNumber || !isPositiveInteger_(startRow)) {
    throw new Error('El mapeo “' + mappingPath + '” tiene una fila o columna inválida.');
  }
  sheet.getRange(startRow, columnNumber, values.length, 1).setValues(values.map(function(value) {
    return [normalizeMappedValue_(value)];
  }));
}

function getMappedSheet_(spreadsheet, sheetName, mappingPath) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(
      'No existe la hoja “' + sheetName + '” indicada en “' + mappingPath + '”. ' +
      'Revise TemplateMapping.gs y la plantilla.'
    );
  }
  return sheet;
}

function assertRowCapacity_(count, mapping, sectionName) {
  if (!isPositiveInteger_(mapping.startRow) || !isPositiveInteger_(mapping.maxRows)) {
    throw new Error('startRow y maxRows de la sección ' + sectionName + ' deben ser enteros positivos.');
  }
  if (count > mapping.maxRows) {
    throw new Error(
      'La sección ' + sectionName + ' admite hasta ' + mapping.maxRows +
      ' componentes según TemplateMapping.gs.'
    );
  }
}

function mappedPercentage_(percentage, asDecimal) {
  return asDecimal ? percentage / 100 : percentage;
}

function normalizeMappedValue_(value) {
  return value == null ? '' : value;
}

function asSafeSheetText_(value) {
  var text = String(value == null ? '' : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function isA1Cell_(value) {
  return /^\$?[A-Z]+\$?[1-9]\d*$/i.test(String(value || '').trim());
}

function isPositiveInteger_(value) {
  return Number(value) === Math.floor(Number(value)) && Number(value) > 0;
}

function getColumnNumber_(column) {
  if (isPositiveInteger_(column)) return Number(column);
  var letters = String(column || '').trim().toUpperCase();
  if (!/^[A-Z]+$/.test(letters)) return 0;
  var number = 0;
  for (var index = 0; index < letters.length; index += 1) {
    number = number * 26 + letters.charCodeAt(index) - 64;
  }
  return number;
}
