const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const app = express();
const dbRouter = require('./routes/database');
const processRouter = require('./routes/process')

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

app.listen(8080, () => {
  console.log('Serveur à l\'écoute');
});
