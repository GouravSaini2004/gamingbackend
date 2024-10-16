const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    // Set the destination for uploaded files
    destination: (req, file, cb) => {
      cb(null, path.resolve(`/opt/render/project/public/uploads`)); // Store files in 'uploads' directory
    },
    // Set the file name for uploaded files
    filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
      cb(null,filename); // Keep the original file extension
    }
  });

  const upload = multer({ storage:storage });

  module.exports = upload;