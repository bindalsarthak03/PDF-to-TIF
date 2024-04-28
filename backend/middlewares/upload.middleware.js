const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Export a function that returns the multer middleware
module.exports = function uploadMiddleware() {
    return multer({ storage: storage }).array('pdfs', 100); // 'pdfs' is the name of the field containing the files, 100 is the maximum number of files allowed
};
