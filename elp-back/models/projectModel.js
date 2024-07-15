const fs = require("fs");
const path = require("path");

class ProjectModel {
  constructor(projectName, projectPath) {
    this.projectName = projectName;
    this.baseDir = projectPath ? path.join(projectPath, this.projectName) : path.join(__dirname, "../uploads/projects", this.projectName);
  }

  // Méthode pour créer la structure des dossiers
  createDirectoryStructure() {
    const directories = [
      this.baseDir,
      path.join(this.baseDir, "routes"),
      path.join(this.baseDir, "controllers"),
      path.join(this.baseDir, "models"),
      path.join(this.baseDir, "config"),
    ];

    directories.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  // Méthode pour créer le fichier .env
  createEnvFile(dbConfig) {
    console.log("Creating .env file with the following content:", dbConfig);
    const envContent = `
DB_HOST=${dbConfig.host}
DB_PORT=${dbConfig.port}
DB_USER=${dbConfig.user}
DB_PASSWORD=${dbConfig.password}
DB_NAME=${dbConfig.dbname}
    `;
    fs.writeFileSync(path.join(this.baseDir, ".env"), envContent);
  }

  // Méthode pour créer le fichier package.json
  createPackageJson(extraDependencies = {}) {
    const packageJsonContent = {
        name: this.projectName,
        version: "1.0.0",
        description: "",
        main: "server.js",
        scripts: {
            test: 'echo "Error: no test specified" && exit 1',
        },
        author: "",
        license: "ISC",
        dependencies: {
            express: "^4.19.2",
            cors: "^2.8.5",
            dotenv: "^16.4.5",
            jsonwebtoken: "^9.0.2",
            mysql2: "^3.10.1",
            nodemailer: "^6.9.13",
            nodemon: "^3.1.0",
            ...extraDependencies // Ajouter les dépendances supplémentaires ici
        },
    };

    const packageJsonPath = path.join(this.baseDir, 'package.json');
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2));
}

  createConfigFile() {
    const configContent = `require('dotenv').config();
const mysql = require('mysql2');

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

const connexion = mysql.createConnection({
  database: dbName,
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  port: dbPort
});

module.exports = connexion;
`;

    fs.writeFileSync(path.join(this.baseDir, "config", "db.js"), configContent);
  }

  // Méthode pour créer le fichier server.js
  createServerFile(tableNames) {
    const imports = tableNames
      .map((name) => `const ${name}Route = require('./routes/${name}');`)
      .join("\n");
    const uses = tableNames
      .map((name) => `app.use('/${name}', ${name}Route);`)
      .join("\n");

    const serverContent = `require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

${imports}

// Import routes
${uses}

app.listen(port, () => {
    console.log(\`Server running on port \${port}\`);
});
`;

    fs.writeFileSync(path.join(this.baseDir, "server.js"), serverContent);
  }
}

module.exports = ProjectModel;
