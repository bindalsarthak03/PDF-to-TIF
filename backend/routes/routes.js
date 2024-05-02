const express = require('express');
const uploadMiddleware = require('../middlewares/upload.middleware')(); 
const { uploadController } = require('../controllers/upload.controller');
const { convertController } = require('../controllers/convert.controller');
const { convertController2 } = require('../controllers/convert2.controller');
const router = express.Router();

router.post('/upload', uploadMiddleware, uploadController);
router.post('/convert', convertController2);

module.exports = router;
