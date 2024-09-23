const db = require('../config/db');

class SqlModel {
    static save(data, callback) {
        const query = "INSERT INTO queries (dbname, tablename, fcname, query) values (?, ?, ?, ?)";
        return db.query(query, [data.dbname, data.tablename, data.fcname, data.query], callback);
    }

    static cleanUp(tableName, callback) {
        const query = "DELETE * FROM queries WHERE tablename = ?";
        return db.query(query, tableName, callback);
    }

    static delete(queryId, callback) {
        const query = "DELETE * FROM queries WHERE id = ?";
        return db.query(query, queryId, callback);
    }

    static getQueriesForTableName(tableName, callback) {
        const query = "SELECT dbname, tablename, fcname, query FROM queries WHERE tablename = ?";
        return db.query(query, tableName, callback);
    }
}

module.exports = SqlModel;