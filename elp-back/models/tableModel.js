const fs = require('fs');
const path = require('path');
const { getModelContent } = require('../process/model');
const { getControllerContent } = require('../process/controller');
const { getRouteContent } = require('../process/route');
const { getDynamiqueRouteContent, getDynamiqueControllerContent, getDynamiqueModelContent } = require('../process/dynamique')

class TableModel {
    constructor(name) {
        this.name = name;
    }

    createFiles(baseDir) {
        const routePath = path.join(baseDir, 'routes', `${this.name}.js`);
        const dRoutePath = path.join(baseDir, 'routes', `dynamique.js`); 
        const controllerPath = path.join(baseDir, 'controllers', `${this.name}Controller.js`);
        const dControllerPath = path.join(baseDir, 'controllers', `dynamiqueController.js`); 
        const modelPath = path.join(baseDir, 'models', `${this.name}Model.js`);
        const dModelPath = path.join(baseDir, 'models', `dynamiqueModel.js`);       

        fs.writeFileSync(routePath, getRouteContent(this.name));
        fs.writeFileSync(dRoutePath, getDynamiqueRouteContent());
        fs.writeFileSync(controllerPath, getControllerContent(this.name));
        fs.writeFileSync(dControllerPath, getDynamiqueControllerContent());
        fs.writeFileSync(modelPath, getModelContent(this.name));
        fs.writeFileSync(dModelPath, getDynamiqueModelContent());
    }
}

module.exports = TableModel;
