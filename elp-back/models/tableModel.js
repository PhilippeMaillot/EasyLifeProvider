const fs = require('fs');
const path = require('path');
const { getModelContent } = require('../process/model');
const { getControllerContent } = require('../process/controller');
const { getRouteContent } = require('../process/route');

class TableModel {
    constructor(name) {
        this.name = name;
    }

    createFiles(baseDir) {
        const modelPath = path.join(baseDir, 'models', `${this.name}Model.js`);
        const controllerPath = path.join(baseDir, 'controllers', `${this.name}Controller.js`);
        const routePath = path.join(baseDir, 'routes', `${this.name}.js`);

        fs.writeFileSync(modelPath, getModelContent(this.name));
        fs.writeFileSync(controllerPath, getControllerContent(this.name));
        fs.writeFileSync(routePath, getRouteContent(this.name));
    }
}

module.exports = TableModel;
