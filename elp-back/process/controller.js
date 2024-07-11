function getControllerContent(name) {
    return `const ${name}Model = require('../models/${name}Model');

class ${name}Controller {
    static async getAll(req, res) {
        try {
            ${name}Model.findAll((error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'An error occurred' });
                }
                res.status(200).json(results);
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    }

    static async create(req, res) {
        try {
            const data = req.body;
            ${name}Model.create(data, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'An error occurred' });
                }
                res.status(201).json({ id: results.insertId, ...data });
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    }

    static async update(req, res) {
        try {
            const data = req.body;
            const { id } = req.params;
            ${name}Model.update(id, data, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'An error occurred' });
                }
                res.status(200).json({ id, ...data });
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            ${name}Model.delete(id, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'An error occurred' });
                }
                res.status(200).json({ message: 'Record deleted' });
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    }
}

module.exports = ${name}Controller;
`;
}

module.exports = { getControllerContent };
