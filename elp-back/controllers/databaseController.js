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

    static getColumns(req, res) {
        try {
            const { dbname, tablename } = req.params;
            dbModel.getColumns(dbname, tablename, (err, results) => {
                if (err) {
                    console.error(`Erreur lors de la récupération des colonnes de la table ${tablename} dans la base de données ${dbname} : ` + err.message);
                    res.status(500).send('Erreur lors de la récupération des colonnes');
                } else {
                    console.log(`Récupération des colonnes de la table ${tablename} dans la base de données ${dbname} réussie`);
                    console.log(results);
                    res.status(200).json(results);
                }
            });
        } catch (err) {
            console.error('Erreur lors de la récupération des colonnes : ' + err.message);
            res.status(500).send('Erreur lors de la récupération des colonnes');
        }
    }
}

module.exports = Database;