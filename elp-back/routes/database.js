const express = require('express');
const router = express.Router();
const dbController = require('../controllers/databaseController');

router.get('/', dbController.getAll);

router.get('/:dbname', dbController.getOne);

router.get('/:dbname/:tablename', dbController.getColumns)

module.exports = router;