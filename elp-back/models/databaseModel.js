const db = require('../config/db');

class Database {
    static getAll(callback) {
        db.query('SHOW DATABASES', (err, results) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, results);
            }
        });
    }

    static getOne(dbname, callback) {
        db.query('SHOW TABLES FROM ' + dbname, (err, results) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, results);
            }
        });
    }
}

module.exports = Database;