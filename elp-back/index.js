const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const app = express();
const dbRouter = require('./routes/database');
const processRouter = require('./routes/process')
const uploadsRouter = require('./routes/uploads');
const directoryPathRoutes = require('./routes/directoryPath');
const sqlRouter = require('./routes/sql');
const path = require('path');

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données : ' + err.message);
  } else {
    console.log('Connexion à la base de données établie');
  }
});

app.use(express.json());
app.use(cors());

app.use('/db', dbRouter);
app.use('/process', processRouter);
app.use('/uploads', uploadsRouter);
app.use('/directoryPath', directoryPathRoutes);
const uploadsDir = path.join(__dirname, '/uploads/zips');
console.log(`Serving files from: ${uploadsDir}`);
app.use('/uploads/zips', express.static(uploadsDir));
app.use('/sql', sqlRouter);

app.listen(8080, () => {
  console.log('Serveur à l\'écoute');
});
