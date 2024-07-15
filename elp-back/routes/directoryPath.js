const express = require('express');
const router = express.Router();
const DirectoryPathController = require('../controllers/directoryPathController');

router.post('/add', DirectoryPathController.addPath);
router.get('/', DirectoryPathController.getPaths);
router.post('/delete', DirectoryPathController.deletePath);

module.exports = router;
