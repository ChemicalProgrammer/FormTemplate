/**
 * Valida el payload completo y devuelve una copia normalizada.
 * @param {Object} payload
 * @return {Object}
 */
function validateAndNormalizePayload_(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('No se recibieron datos del formulario.');
  }

  var normalized = {
    caseName: normalizeCaseName_(payload.caseName),
    sectionA: validateSectionA_(payload.sectionA || {}),
    components: validateComponents_(payload.components || []),
    sectionD: validateSectionD_(payload.sectionD || {})
  };
  return normalized;
}

function normalizeCaseName_(value) {
  var name = String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!name) {
    throw new Error('El nombre del caso es obligatorio.');
  }
  if (name.length > APP_CONFIG.maxCaseNameLength) {
    throw new Error('El nombre del caso no puede exceder ' + APP_CONFIG.maxCaseNameLength + ' caracteres.');
  }
  return name;
}

function validateSectionA_(answers) {
  var normalized = {};
  FORM_SCHEMA.sectionA.fields.forEach(function(field) {
    var value = String(answers[field.id] == null ? '' : answers[field.id]).trim();
    if (field.required && !value) {
      throw new Error('Complete el campo “' + field.label + '” de la sección A.');
    }
    if (field.type === 'select' && value && field.options.indexOf(value) === -1) {
      throw new Error('La selección de “' + field.label + '” no es válida.');
    }
    normalized[field.id] = value;
  });
  return normalized;
}

function validateComponents_(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Agregue al menos un componente en la sección B.');
  }

  var database = getComponentMap_();
  var seen = {};
  var total = 0;
  var normalized = items.map(function(item) {
    var code = String(item.code || '').trim();
    var percentage = parseNumber_(item.percentage);
    var component = database[code];

    if (!component) {
      throw new Error('Uno de los componentes seleccionados no existe en la base de datos.');
    }
    if (seen[code]) {
      throw new Error('El componente ' + code + ' está repetido.');
    }
    if (!isFinite(percentage) || percentage <= 0 || percentage > 100) {
      throw new Error('El porcentaje de ' + code + ' debe ser mayor que 0 y menor o igual que 100.');
    }

    seen[code] = true;
    total += percentage;
    return {
      code: component.code,
      name: component.name,
      percentage: percentage,
      characteristics: JSON.parse(JSON.stringify(component.characteristics))
    };
  });

  if (Math.abs(total - 100) > APP_CONFIG.percentageTolerance) {
    throw new Error('La suma de componentes debe ser 100%. Actualmente es ' + formatNumber_(total) + '%.');
  }
  return normalized;
}

function validateSectionD_(answers) {
  var normalized = {};
  FORM_SCHEMA.sectionD.fields.forEach(function(field) {
    var item = answers[field.id] || {};
    var min = parseNumber_(item.min);
    var target = parseNumber_(item.target);
    var max = parseNumber_(item.max);

    if (![min, target, max].every(isFinite)) {
      throw new Error('Complete Min, Target y Max para “' + field.label + '”.');
    }
    if (!(min <= target && target <= max)) {
      throw new Error('En “' + field.label + '” debe cumplirse Min ≤ Target ≤ Max.');
    }
    normalized[field.id] = { min: min, target: target, max: max };
  });
  return normalized;
}

function parseNumber_(value) {
  if (typeof value === 'number') {
    return value;
  }
  var text = String(value == null ? '' : value).trim().replace(',', '.');
  return text === '' ? NaN : Number(text);
}

function formatNumber_(value) {
  return Number(value.toFixed(4)).toString();
}
