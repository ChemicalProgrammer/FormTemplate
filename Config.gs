/**
 * General application configuration.
 * Edit this file to change technical names and global rules.
 */
var APP_CONFIG = Object.freeze({
  appName: 'Case Form',
  numberedFolders: ['01', '02', '03', '04'],
  generatedFileSuffix: ' - Form',
  percentageTolerance: 0.01,
  lockTimeoutMs: 30000,
  maxCaseNameLength: 120,
  userPropertyKeys: {
    destinationFolderId: 'DESTINATION_FOLDER_ID',
    templateSpreadsheetId: 'TEMPLATE_SPREADSHEET_ID'
  }
});
