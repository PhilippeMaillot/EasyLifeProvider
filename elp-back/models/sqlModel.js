const db = require('../config/db');

class SqlModel {
    static save(data, callback) {
        const query = "INSERT INTO queries (dbname, fcname, query) values (?, ?, ?)";
        return db.query(query, [data.dbname, data.fcname, data.query], callback);
    }

    static cleanUp(dbname, callback) {
        const query = "DELETE * FROM queries WHERE dbname = ?";
        return db.query(query, dbname, callback);
    }

    static delete(queryId, callback) {
        const query = "DELETE * FROM queries WHERE id = ?";
        return db.query(query, queryId, callback);
    }

    static getQueriesForDbname(dbname, callback) {
        const query = "SELECT * FROM queries WHERE dbname = ?";
        return db.query(query, dbname, callback);
    }
}

module.exports = SqlModel;