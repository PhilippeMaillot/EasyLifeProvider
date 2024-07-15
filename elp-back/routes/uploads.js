const express = require('express');
const router = express.Router();
const uploadsController = require('../controllers/uploadsController');

router.get('/get', uploadsController.getUploads);

module.exports = router;
