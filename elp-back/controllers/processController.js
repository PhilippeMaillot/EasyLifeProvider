const ProjectModel = require('../models/projectModel');
const TableModel = require('../models/tableModel');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

class ProcessController {
    static function executeAll = async (req, res) => {

    }

    static function executeZip = (req, res) => {
        const { projectName, tableNames, dbConfig } = req.body;
    
        if (!projectName || !Array.isArray(tableNames)) {
            return res.status(400).send('Invalid input');
        }
    
        // Créer le projet avec les dossiers nécessaires
        const project = new ProjectModel(projectName);
        project.createDirectoryStructure();
        project.createEnvFile(dbConfig);
        project.createPackageJson();
        project.createConfigFile();
        project.createServerFile(tableNames);
    
        // Créer les fichiers pour chaque table dans le bon répertoire
        tableNames.forEach(name => {
            const table = new TableModel(name);
            table.createFiles(project.baseDir);
        });
    
        // Créer le fichier ZIP
        const zipFileName = `${projectName}.zip`;
        const zipFilePath = path.join(__dirname, '../', zipFileName);
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Compression level
        });
    
        output.on('close', () => {
            res.download(zipFilePath, zipFileName, (err) => {
                if (err) {
                    console.error('Erreur lors du téléchargement du fichier:', err);
                    return res.status(500).send('Erreur lors du téléchargement du fichier');
                }
                // Supprimer le fichier zip après le téléchargement
                fs.unlinkSync(zipFilePath);
                // Supprimer les fichiers et dossiers temporaires après le téléchargement
                deleteFolderRecursive(project.baseDir);
            });
        });
    
        archive.on('error', (err) => {
            throw err;
        });
    
        archive.pipe(output);
    
        archive.directory(project.baseDir, false);
    
        archive.finalize();
    };
    
    function deleteFolderRecursive(folderPath) {
        if (fs.existsSync(folderPath)) {
            fs.readdirSync(folderPath).forEach((file, index) => {
                const curPath = path.join(folderPath, file);
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(folderPath);
        }
    }
}

module.exports = ProcessController;