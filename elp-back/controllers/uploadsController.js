const fs = require('fs');
const path = require('path');

class UploadsController {
    static getUploads = (req, res) => {
        const uploadsDir = path.join(__dirname, '../uploads/zips');
        console.log(uploadsDir);
        fs.readdir(uploadsDir, (err, files) => {
          if (err) {
            return res.status(500).send('Erreur lors de la lecture du répertoire des uploads.');
          }
      
          const zipFiles = files.filter(file => path.extname(file) === '.zip');
          res.json(zipFiles);
        });
      };
};

module.exports = UploadsController;
