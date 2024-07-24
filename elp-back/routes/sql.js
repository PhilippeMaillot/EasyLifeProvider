const express = require('express');
const router = express.Router();
const sqlController = require('../controllers/sqlController');

//router.post('/generate', sqlController.generateSql); Comprendre/apprendre l'api de OPENAI avant d'activer

router.post('/save', sqlController.saveQuery);

router.post('/cleanQueries/:dbname', sqlController.deleteQueries);

router.post('/delete/:queryId', sqlController.delete);

router.get('/getQueries/:dbname', sqlController.getQueriesForDbname);

module.exports = router;