const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

module.exports = function uploadMiddleware() {
    return multer({ storage: storage }).array('pdfs', 100); 
};
