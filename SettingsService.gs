/**
 * Obtiene las opciones particulares del usuario actual.
 * @return {{destinationFolderId:string, templateSpreadsheetId:string}}
 */
function getUserSettings() {
  var properties = PropertiesService.getUserProperties();
  return {
    destinationFolderId: properties.getProperty(
      APP_CONFIG.userPropertyKeys.destinationFolderId
    ) || '',
    templateSpreadsheetId: properties.getProperty(
      APP_CONFIG.userPropertyKeys.templateSpreadsheetId
    ) || ''
  };
}

/**
 * Valida y guarda la carpeta destino y la plantilla de Google Sheets.
 * Acepta tanto IDs como URLs de Drive.
 * @param {Object} settings
 * @return {Object}
 */
function saveUserSettings(settings) {
  settings = settings || {};
  var destinationFolderId = extractDriveId_(settings.destinationFolderId);
  var templateSpreadsheetId = extractDriveId_(settings.templateSpreadsheetId);

  if (!destinationFolderId || !templateSpreadsheetId) {
    throw new Error('Ingrese una carpeta destino y una plantilla válidas. Puede pegar el enlace completo o el ID.');
  }

  var folder;
  var template;
  try {
    folder = DriveApp.getFolderById(destinationFolderId);
    folder.getName();
  } catch (error) {
    throw new Error('No se pudo abrir la carpeta destino. Revise el ID y sus permisos.');
  }

  try {
    template = DriveApp.getFileById(templateSpreadsheetId);
    template.getName();
  } catch (error) {
    throw new Error('No se pudo abrir la plantilla. Revise el ID y sus permisos.');
  }

  if (template.getMimeType() !== MimeType.GOOGLE_SHEETS) {
    throw new Error('La plantilla debe ser un archivo nativo de Google Sheets.');
  }

  var properties = PropertiesService.getUserProperties();
  var values = {};
  values[APP_CONFIG.userPropertyKeys.destinationFolderId] = destinationFolderId;
  values[APP_CONFIG.userPropertyKeys.templateSpreadsheetId] = templateSpreadsheetId;
  properties.setProperties(values, false);

  return {
    ok: true,
    destinationFolderId: destinationFolderId,
    destinationFolderName: folder.getName(),
    templateSpreadsheetId: templateSpreadsheetId,
    templateSpreadsheetName: template.getName()
  };
}

function areSettingsComplete_() {
  var settings = getUserSettings();
  return Boolean(settings.destinationFolderId && settings.templateSpreadsheetId);
}

function getValidatedSettings_() {
  var settings = getUserSettings();
  if (!settings.destinationFolderId || !settings.templateSpreadsheetId) {
    throw new Error('Configure la carpeta destino y la plantilla antes de crear un caso.');
  }

  // Se vuelven a validar los permisos porque pueden cambiar después de guardar.
  try {
    DriveApp.getFolderById(settings.destinationFolderId).getName();
    var template = DriveApp.getFileById(settings.templateSpreadsheetId);
    if (template.getMimeType() !== MimeType.GOOGLE_SHEETS) {
      throw new Error('La plantilla ya no es un archivo de Google Sheets.');
    }
  } catch (error) {
    throw new Error('Las opciones guardadas ya no son accesibles. Ábralas y vuelva a guardar los enlaces.');
  }
  return settings;
}

function extractDriveId_(value) {
  var text = String(value || '').trim();
  var match = text.match(/[-\w]{20,}/);
  return match ? match[0] : '';
}
