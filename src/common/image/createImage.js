const createFileDetails = (folderName, filename) => {
  return `/public/uploads/${folderName}/${filename}`;
};
module.exports = { createFileDetails };
