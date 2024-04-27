const express = require('express');
const { uploadMiddleware } = require('../middlewares/upload.middleware');
const { uploadController } = require('../controllers/upload.controller');
const { convertController } = require('../controllers/convert.controller');
const router = express.Router();

router.post('/upload',uploadMiddleware.single('pdfs'),uploadController)
router.post('/convert',convertController);

module.exports = router;