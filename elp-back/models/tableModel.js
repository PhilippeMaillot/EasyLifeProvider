const fs = require('fs');
const path = require('path');

class TableModel {
    constructor(name) {
        this.name = name;
    }

    // Méthode pour générer le contenu du fichier modèle
    getModelContent() {
        return `class ${this.name}Model {

            static findAll(callback) {
            return db.query("SELECT * FROM ${name}", callback);
            }
        }

        module.exports = ${this.name}Model;
        `;
    }

    // Méthode pour générer le contenu du fichier contrôleur
    getControllerContent() {
        return `const ${this.name}Model = require('../models/${this.name}Model');

        class ${this.name}Controller {
            static async getAll(req, res) {
                try {
                    const results = await ${this.name}Model.findAll();
                    res.status(200).json(results);
                } catch (error) {
                    res.status(500).json({ error: 'An error occurred' });
                }
            }

            static async create(req, res) {
                // Implement create logic here
            }

            static async update(req, res) {
                // Implement update logic here
            }

            static async delete(req, res) {
                // Implement delete logic here
            }
        }

        module.exports = ${this.name}Controller;
        `;
    }

    // Méthode pour générer le contenu du fichier route
    getRouteContent() {
        return `const express = require('express');
        const router = express.Router();
        const ${this.name}Controller = require('../controllers/${this.name}Controller');

        router.get('/', ${this.name}Controller.getAll);
        router.post('/', ${this.name}Controller.create);
        router.put('/:id', ${this.name}Controller.update);
        router.delete('/:id', ${this.name}Controller.delete);

        module.exports = router;
        `;
    }

    // Méthode pour créer les fichiers dans les dossiers spécifiés
    createFiles(baseDir) {
        const modelPath = path.join(baseDir, 'models', `${this.name}Model.js`);
        const controllerPath = path.join(baseDir, 'controllers', `${this.name}Controller.js`);
        const routePath = path.join(baseDir, 'routes', `${this.name}.js`);

        fs.writeFileSync(modelPath, this.getModelContent());
        fs.writeFileSync(controllerPath, this.getControllerContent());
        fs.writeFileSync(routePath, this.getRouteContent());
    }
}

module.exports = TableModel;
