const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/savedPaths.json');

class DirectoryPathController {

    static initializeFile() {
        if (!fs.existsSync(filePath)) {
            console.log('File does not exist. Creating new file:', filePath);
            fs.writeFileSync(filePath, JSON.stringify([]));
        } else {
            console.log('File exists:', filePath);
        }
    }

    static addPath(req, res) {
        console.log('addPath called with body:', req.body);
        const { path: newPath } = req.body;

        if (!newPath) {
            console.log('Invalid input: path is missing');
            return res.status(400).send('Invalid input');
        }

        DirectoryPathController.initializeFile();

        let paths = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        console.log('Current paths:', paths);

        if (!paths.includes(newPath)) {
            paths.push(newPath);
            fs.writeFileSync(filePath, JSON.stringify(paths, null, 2));
            console.log('Path added:', newPath);
        } else {
            console.log('Path already exists:', newPath);
        }

        res.status(200).send('Path saved successfully');
    }

    static getPaths(req, res) {
        console.log('getPaths called');
        DirectoryPathController.initializeFile();

        const paths = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        console.log('Returning paths:', paths);
        res.json(paths);
    }

    static deletePath(req, res) {
        console.log('deletePath called with body:', req.body);
        const { path: deletePath } = req.body;

        if (!deletePath) {
            console.log('Invalid input: path is missing');
            return res.status(400).send('Invalid input');
        }

        DirectoryPathController.initializeFile();

        let paths = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        console.log('Current paths:', paths);

        paths = paths.filter(p => p !== deletePath);
        fs.writeFileSync(filePath, JSON.stringify(paths, null, 2));
        console.log('Path deleted:', deletePath);

        res.status(200).send('Path deleted successfully');
    }
}

module.exports = DirectoryPathController;
