function getModelContent(name) {
    const baseMethods = `
const db = require('../config/db');

class ${name}Model {

    static findAll(callback) {
        return db.query("SELECT * FROM ${name}", [], callback);
    }

    static findOne(id, callback) {
        return db.query("SELECT * FROM ${name} WHERE id = ?", [id], callback);
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
`;
    return `${baseMethods}
}

module.exports = ${name}Model;
`;
}

module.exports = { getModelContent };
