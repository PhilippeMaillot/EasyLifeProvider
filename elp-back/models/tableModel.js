const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { getModelContent } = require("../process/model");
const { getControllerContent } = require("../process/controller");
const { getRouteContent } = require("../process/route");
const { getDynamiqueRouteContent, getDynamiqueControllerContent, getDynamiqueModelContent } = require("../process/dynamique");

class TableModel {
  constructor(name) {
    this.name = name;
  }

  async createFiles(baseDir) {
    try {
      /*const response = await axios.post("http://localhost:8080/sql/getQueries/" + this.name);
      const data = response.data;*/

      const routePath = path.join(baseDir, "routes", `${this.name}.js`);
      const dRoutePath = path.join(baseDir, "routes", `dynamique.js`);
      const controllerPath = path.join(baseDir, "controllers",`${this.name}Controller.js`);
      const dControllerPath = path.join(baseDir, "controllers", `dynamiqueController.js`);
      const modelPath = path.join(baseDir, "models", `${this.name}Model.js`);
      const dModelPath = path.join(baseDir, "models",`dynamiqueModel.js`);

      fs.writeFileSync(routePath, getRouteContent(this.name, /*data*/));
      fs.writeFileSync(dRoutePath, getDynamiqueRouteContent());
      fs.writeFileSync(controllerPath, getControllerContent(this.name, /*data*/));
      fs.writeFileSync(dControllerPath, getDynamiqueControllerContent());
      fs.writeFileSync(modelPath, getModelContent(this.name, /*data*/));
      fs.writeFileSync(dModelPath, getDynamiqueModelContent());
    } catch (error) {
      console.error("Error fetching data or writing files:", error);
    }
  }
}

module.exports = TableModel;
