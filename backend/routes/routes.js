const express = require('express');
const uploadMiddleware = require('../middlewares/upload.middleware')(); // Notice the invocation here
const { uploadController } = require('../controllers/upload.controller');
const { convertController } = require('../controllers/convert.controller');
const router = express.Router();

router.post('/upload', uploadMiddleware, uploadController);
router.post('/convert', convertController);

module.exports = router;
