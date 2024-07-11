function getModelContent(name) {
    return `const db = require('../db');

class ${name}Model {

    static findAll(callback) {
        return db.query("SELECT * FROM ${name}", [], callback);
    }

    static create(data, callback) {
        const query = "INSERT INTO ${name} SET ?";
        return db.query(query, data, callback);
    }

    static update(id, data, callback) {
        const query = "UPDATE ${name} SET ? WHERE id = ?";
        return db.query(query, [data, id], callback);
    }

    static delete(id, callback) {
        const query = "DELETE FROM ${name} WHERE id = ?";
        return db.query(query, [id], callback);
    }
}

module.exports = ${name}Model;
`;
}

module.exports = { getModelContent };
