const express = require('express');
const router = express.Router();
const dbController = require('../controllers/databaseController');

router.get('/', dbController.getAll);

router.get('/:dbname', dbController.getOne);

module.exports = router;