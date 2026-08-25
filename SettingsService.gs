/**
 * Returns settings for the current user.
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
 * Validates and saves the destination folder and Google Sheets template.
 * Accepts Drive IDs or complete URLs.
 * @param {Object} settings
 * @return {Object}
 */
function saveUserSettings(settings) {
  settings = settings || {};
  var destinationFolderId = extractDriveId_(settings.destinationFolderId);
  var templateSpreadsheetId = extractDriveId_(settings.templateSpreadsheetId);

  if (!destinationFolderId || !templateSpreadsheetId) {
    throw new Error('Enter a valid destination folder and template. You may paste the complete URL or ID.');
  }

  var folder;
  var template;
  try {
    folder = DriveApp.getFolderById(destinationFolderId);
    folder.getName();
  } catch (error) {
    throw new Error('The destination folder could not be opened. Check the ID and your permissions.');
  }

  try {
    template = DriveApp.getFileById(templateSpreadsheetId);
    template.getName();
  } catch (error) {
    throw new Error('The template could not be opened. Check the ID and your permissions.');
  }

  if (template.getMimeType() !== MimeType.GOOGLE_SHEETS) {
    throw new Error('The template must be a native Google Sheets file.');
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
    throw new Error('Configure the destination folder and template before creating a case.');
  }

  // Revalidate permissions because they may change after settings are saved.
  try {
    DriveApp.getFolderById(settings.destinationFolderId).getName();
    var template = DriveApp.getFileById(settings.templateSpreadsheetId);
    if (template.getMimeType() !== MimeType.GOOGLE_SHEETS) {
      throw new Error('The template is no longer a Google Sheets file.');
    }
  } catch (error) {
    throw new Error('The saved settings are no longer accessible. Open Settings and save the links again.');
  }
  return settings;
}

function extractDriveId_(value) {
  var text = String(value || '').trim();
  var match = text.match(/[-\w]{20,}/);
  return match ? match[0] : '';
}
