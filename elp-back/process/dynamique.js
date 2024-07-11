function getDynamiqueRouteContent() {
    return `const express = require('express');
const router = express.Router();
const dynamiqueController = require('../controllers/dynamiqueController');

router.post('/insert', dynamiqueController.insertRecord);

router.post('/update', dynamiqueController.updateRecord);

router.post('/delete', dynamiqueController.deleteRecord);

module.exports = router;
`;
}

function getDynamiqueControllerContent() {
    return `const dynamiqueModel = require('../models/dynamiqueModel');

class DynamiqueController {
  static updateRecord = async (req, res) => {
    try {
      const { table, column, id, idValue, newValue } = req.body;
      const result = await dynamiqueModel.updateRecord(table, column, id, idValue, newValue);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Mise à jour réussie' });
      } else {
        res.status(404).json({ message: 'Enregistrement non trouvé' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };

  static insertRecord = async (req, res) => {
    try {
      const { table, columns, values } = req.body;
      const result = await dynamiqueModel.insertRecord(table, columns, values);
      res.status(200).json({ message: 'Insertion réussie', insertId: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };

  static deleteRecord = async (req, res) => {
    try {
      const { table, id, idValue } = req.body;
      const result = await dynamiqueModel.deleteRecord(table, id, idValue);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Suppression réussie' });
      } else {
        res.status(404).json({ message: 'Enregistrement non trouvé' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };
}

module.exports = DynamiqueController;
`;
}

function getDynamiqueModelContent() {
    return `const db = require('../config/db');

class DynamiqueModel {
  static updateRecord = (table, column, id, idValue, newValue) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
      db.query(query, [table, column, newValue, id, idValue], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  };

  static insertRecord = (table, columns, values) => {
    return new Promise((resolve, reject) => {
      const placeholders = columns.map(() => '?').join(', ');
      const query = \`INSERT INTO ?? (??) VALUES (\${placeholders})\`;
      db.query(query, [table, columns, ...values], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  };

  static deleteRecord = (table, id, idValue) => {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM ?? WHERE ?? = ?';
      db.query(query, [table, id, idValue], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  };
}

module.exports = DynamiqueModel;
`;
}

module.exports = { getDynamiqueRouteContent, getDynamiqueControllerContent, getDynamiqueModelContent };