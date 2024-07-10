const express = require('express');
const router = express.Router();
const processController = require('../controllers/processController');

//router.post('/', processController.executeAll);

router.post('/zip', processController.executeZip);

module.exports = router;