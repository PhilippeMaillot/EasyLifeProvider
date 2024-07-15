const ProjectModel = require('../models/projectModel');
const TableModel = require('../models/tableModel');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

class ProcessController {
    static executeAll = async (req, res) => {
        // Implémentation de executeAll si nécessaire
    }

    static executeZip = async (req, res) => {
        const { projectName, tableNames, dbConfig, extraDependencies, projectPath } = req.body;

        console.log('Received request to create project and ZIP file with the following data:', req.body);

        if (!projectName || !Array.isArray(tableNames) || !extraDependencies) {
            console.log('Invalid input');
            return res.status(400).send('Invalid input');
        }

        const finalProjectPath = projectPath || path.join(__dirname, "../uploads/projects");

        try {
            // Récupérer les informations des dépendances supplémentaires depuis l'API de npm
            const dependencies = await ProcessController.getDependencies(extraDependencies);

            // Créer le projet avec les dossiers nécessaires
            const project = new ProjectModel(projectName, finalProjectPath);
            project.createDirectoryStructure();
            project.createEnvFile(dbConfig);
            project.createPackageJson(dependencies); // Passer les dépendances supplémentaires ici
            project.createConfigFile();
            project.createServerFile(tableNames);

            // Créer les fichiers pour chaque table dans le bon répertoire
            tableNames.forEach(name => {
                const table = new TableModel(name);
                table.createFiles(project.baseDir);
            });

            // Créer le fichier ZIP
            const zipFileName = `${projectName}.zip`;
            const zipFilePath = path.join(__dirname, '../uploads/zips', zipFileName);
            console.log('zipFilePath:', zipFilePath);
            const output = fs.createWriteStream(zipFilePath);
            const archive = archiver('zip', {
                zlib: { level: 9 } // Niveau de compression
            });

            output.on('close', () => {
                console.log(`ZIP file ${zipFileName} has been created and saved to ${zipFilePath}.`);
                res.status(200).send(`Project ${projectName} has been created and zipped successfully.`);
            });

            archive.on('error', (err) => {
                throw err;
            });

            archive.pipe(output);
            archive.directory(project.baseDir, false);
            archive.finalize();
        } catch (error) {
            console.error('An error occurred:', error);
            res.status(500).send('An error occurred while creating the project and ZIP file.');
        }
    };

    static async getDependencies(extraDependencies) {
        const dependencies = {};
        for (const [pkg, version] of Object.entries(extraDependencies)) {
            try {
                const response = await axios.get(`https://registry.npmjs.org/${pkg}`);
                const latestVersion = response.data['dist-tags'].latest;
                dependencies[pkg] = version || latestVersion;
            } catch (error) {
                console.error(`Error fetching information for package ${pkg}:`, error);
            }
        }
        return dependencies;
    }

    // La méthode deleteFolderRecursive n'est plus nécessaire ici car nous ne supprimons rien
}

module.exports = ProcessController;
