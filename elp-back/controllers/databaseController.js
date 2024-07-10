const dbModel = require('../models/databaseModel');

class Database {
    static getAll(req, res) {
        try {
            dbModel.getAll((err, results) => {
                if (err) {
                    console.error('Erreur lors de la récupération des bases de données : ' + err.message);
                    res.status(500).send('Erreur lors de la récupération des bases de données');
                } else {
                    console.log('Récupération des bases de données réussie');
                    res.status(200).json(results);
                }
            });
        } catch (err) {
            console.error('Erreur lors de la récupération des bases de données : ' + err.message);
            res.status(500).send('Erreur lors de la récupération des bases de données');
        }
    }

    static getOne(req, res) {
        try {
            dbModel.getOne(req.params.dbname, (err, results) => {
                if (err) {
                    console.error('Erreur lors de la récupération de la base de données : ' + err.message);
                    res.status(500).send('Erreur lors de la récupération de la base de données');
                } else {
                    console.log(`Récupération des tables de la base de données ${req.params.dbname} réussie`);
                    res.status(200).json(results);
                }
            });
        } catch (err) {
            console.error('Erreur lors de la récupération de la base de données : ' + err.message);
            res.status(500).send('Erreur lors de la récupération de la base de données');
        }
    }
}

module.exports = Database;