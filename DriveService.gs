/**
 * Creates the case folder and its four numbered subfolders.
 * @param {string} destinationFolderId
 * @param {string} caseName
 * @return {Object}
 */
function createCaseFolderStructure_(destinationFolderId, caseName) {
  var destination = DriveApp.getFolderById(destinationFolderId);
  var duplicates = destination.getFoldersByName(caseName);
  if (duplicates.hasNext()) {
    throw new Error('A folder named “' + caseName + '” already exists in the destination folder.');
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
