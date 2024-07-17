const express = require('express');
const router = express.Router();
const sqlController = require('../controllers/sqlController');

router.post('/generate', sqlController.generateSql);

module.exports = router;