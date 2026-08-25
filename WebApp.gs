/**
 * Web application entry point.
 */
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle(APP_CONFIG.appName)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Allows HTML to be split into reusable files.
 * @param {string} filename HTML filename without the extension.
 * @return {string}
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Initial data required to build the interface.
 * @return {Object}
 */
function getBootstrapData() {
  return {
    appName: APP_CONFIG.appName,
    schema: getFormSchema(),
    components: getComponents(),
    settings: getUserSettings(),
    settingsComplete: areSettingsComplete_()
  };
}

/**
 * Coordinates validation, folder creation, and spreadsheet generation.
 * @param {Object} payload Answers submitted by the interface.
 * @return {Object} Links to the created items.
 */
function submitCase(payload) {
  // Shared lock prevents duplicate names when two submissions arrive at
  // nearly the same time.
  var lock = LockService.getScriptLock();
  lock.waitLock(APP_CONFIG.lockTimeoutMs);

  var caseFolder = null;
  try {
    var settings = getValidatedSettings_();
    var normalized = validateAndNormalizePayload_(payload);
    var structure = createCaseFolderStructure_(
      settings.destinationFolderId,
      normalized.caseName
    );
    caseFolder = structure.caseFolder;

    var generatedFile = createSpreadsheetFromTemplate_(
      settings.templateSpreadsheetId,
      structure.numberedFolders['01'],
      normalized
    );

    return {
      ok: true,
      caseName: normalized.caseName,
      caseFolderUrl: structure.caseFolder.getUrl(),
      spreadsheetUrl: generatedFile.getUrl(),
      spreadsheetName: generatedFile.getName()
    };
  } catch (error) {
    // If generation fails after folder creation, the new case folder is moved
    // to trash to avoid incomplete structures. It remains recoverable in Drive.
    if (caseFolder) {
      try {
        caseFolder.setTrashed(true);
      } catch (cleanupError) {
        console.error('The incomplete folder could not be cleaned up: ' + cleanupError.message);
      }
    }
    throw new Error(error && error.message ? error.message : String(error));
  } finally {
    lock.releaseLock();
  }
}
