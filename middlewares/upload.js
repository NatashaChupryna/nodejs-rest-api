const multer = require("multer");
const path = require("path");

const tempPath = path.join(__dirname, "../", "tmp");

const multerConfig = multer.diskStorage({
  destination: tempPath,
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
