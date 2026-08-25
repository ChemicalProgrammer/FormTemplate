/**
 * Punto de entrada de la aplicación web.
 */
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle(APP_CONFIG.appName)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Permite dividir el HTML en archivos reutilizables.
 * @param {string} filename Nombre del archivo HTML sin extensión.
 * @return {string}
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Datos iniciales necesarios para construir la interfaz.
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
 * Orquesta la validación, creación de carpetas y generación de la hoja.
 * @param {Object} payload Respuestas enviadas por la interfaz.
 * @return {Object} Enlaces a los elementos creados.
 */
function submitCase(payload) {
  // Bloqueo compartido entre usuarios para evitar nombres duplicados si dos
  // envíos llegan casi al mismo tiempo.
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
    // Si algo falla después de crear el caso, se envía esa carpeta nueva a la
    // papelera para no dejar estructuras incompletas. Es recuperable en Drive.
    if (caseFolder) {
      try {
        caseFolder.setTrashed(true);
      } catch (cleanupError) {
        console.error('No se pudo limpiar la carpeta incompleta: ' + cleanupError.message);
      }
    }
    throw new Error(error && error.message ? error.message : String(error));
  } finally {
    lock.releaseLock();
  }
}
