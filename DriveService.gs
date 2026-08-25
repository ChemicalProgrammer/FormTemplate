/**
 * Crea la carpeta del caso y sus cuatro subcarpetas numeradas.
 * @param {string} destinationFolderId
 * @param {string} caseName
 * @return {Object}
 */
function createCaseFolderStructure_(destinationFolderId, caseName) {
  var destination = DriveApp.getFolderById(destinationFolderId);
  var duplicates = destination.getFoldersByName(caseName);
  if (duplicates.hasNext()) {
    throw new Error('Ya existe una carpeta llamada “' + caseName + '” en el directorio destino.');
  }

  var caseFolder = destination.createFolder(caseName);
  var numberedFolders = {};
  APP_CONFIG.numberedFolders.forEach(function(folderName) {
    numberedFolders[folderName] = caseFolder.createFolder(folderName);
  });

  return {
    caseFolder: caseFolder,
    numberedFolders: numberedFolders
  };
}
