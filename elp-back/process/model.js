function getModelContent(name, data) {
    const baseMethods = `
const db = require('../config/db');

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
`;

    const dynamicMethods = data.map(item => {
        return `    static ${item.fcname}(data, callback) {
        const query = \`${item.query}\`;
        return db.query(query, [data], callback);
    }`;
    }).join('\n');

    return `${baseMethods}
${dynamicMethods}
}

module.exports = ${name}Model;
`;
}

module.exports = { getModelContent };
