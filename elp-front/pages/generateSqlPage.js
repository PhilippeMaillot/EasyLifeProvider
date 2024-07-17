import React, { useState, useEffect } from "react";
import {
  Container, Typography, TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Box, FormGroup, FormControlLabel, Checkbox
} from "@mui/material";
import Navbar from "../components/Navbar";
import Head from "next/head";

const GenerateSqlPage = () => {
  const [table, setTable] = useState("");
  const [operation, setOperation] = useState("SELECT");
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [condition, setCondition] = useState("");
  const [joinTable, setJoinTable] = useState("");
  const [joinCondition, setJoinCondition] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [limit, setLimit] = useState("");
  const [values, setValues] = useState("");
  const [tables, setTables] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [dbSelect, setDbSelect] = useState("");
  const [joinColumns, setJoinColumns] = useState([]);
  const [joinTableColumns, setJoinTableColumns] = useState([]);
  const [showJoin, setShowJoin] = useState(false);

  useEffect(() => {
    fetchDatabases();
  }, []);

  useEffect(() => {
    if (dbSelect) {
      fetchTables();
    }
  }, [dbSelect]);

  useEffect(() => {
    if (table) {
      fetchColumns(table, setColumns);
    }
  }, [table]);

  useEffect(() => {
    if (joinTable) {
      fetchColumns(joinTable, setJoinTableColumns);
    }
  }, [joinTable]);

  const fetchDatabases = async () => {
    try {
      const response = await fetch("http://localhost:8080/db");
      const data = await response.json();
      setDatabases(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des bases de données:", error);
    }
  };

  const fetchTables = async () => {
    if (!dbSelect) return;
    try {
      const response = await fetch(`http://localhost:8080/db/${dbSelect}`);
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des tables:", error);
    }
  };

  const fetchColumns = async (table, setColumnsCallback) => {
    try {
      const response = await fetch(`http://localhost:8080/db/${dbSelect}/${table}`);
      const data = await response.json();
      setColumnsCallback(data);
    } catch (error) {
      console.error(`Erreur lors de la récupération des colonnes pour la table ${table}:`, error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let prompt = `Génère une requête SQL pour ${operation} dans la table ${table}`;
    if (selectedColumns.length > 0) {
      prompt += ` avec les colonnes ${selectedColumns.join(", ")}`;
    }
    if (joinTable && joinCondition) {
      prompt += ` en joignant la table ${joinTable} sur la condition ${joinCondition}`;
    }
    if (condition) {
      prompt += ` où ${condition}`;
    }
    if (orderBy) {
      prompt += ` trié par ${orderBy}`;
    }
    if (limit) {
      prompt += ` limité à ${limit} résultats`;
    }
    if ((operation === "INSERT" || operation === "UPDATE") && values) {
      prompt += ` avec les valeurs ${values}`;
    }
    prompt += ". Génère uniquement une requête SQL préparée sans texte supplémentaire.";

    const response = await fetch('http://localhost:8080/sql/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    alert(data.sql); // Affichez la requête SQL générée
  };

  return (
    <>
      <Head>
        <title>ELP - génération de requète SQL</title>
      </Head>
      <Navbar />
      <Container>
        <Typography variant="h4" gutterBottom>Génération de Requêtes SQL</Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="db-select-label">Base de données</InputLabel>
            <Select
              labelId="db-select-label"
              value={dbSelect}
              onChange={(e) => setDbSelect(e.target.value)}
              required
            >
              {databases.map((db) => (
                <MenuItem key={db.Database} value={db.Database}>
                  {db.Database}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="table-select-label">Table</InputLabel>
            <Select
              labelId="table-select-label"
              value={table}
              onChange={(e) => setTable(e.target.value)}
              required
            >
              {tables.map((t) => (
                <MenuItem key={t[`Tables_in_${dbSelect}`]} value={t[`Tables_in_${dbSelect}`]}>
                  {t[`Tables_in_${dbSelect}`]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="operation-select-label">Opération</InputLabel>
            <Select
              labelId="operation-select-label"
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              required
            >
              <MenuItem value="SELECT">SELECT</MenuItem>
              <MenuItem value="INSERT">INSERT</MenuItem>
              <MenuItem value="UPDATE">UPDATE</MenuItem>
              <MenuItem value="DELETE">DELETE</MenuItem>
            </Select>
          </FormControl>
          {columns.length > 0 && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="columns-select-label">Colonnes</InputLabel>
              <Select
                labelId="columns-select-label"
                multiple
                value={selectedColumns}
                onChange={(e) => setSelectedColumns(e.target.value)}
                renderValue={(selected) => selected.join(', ')}
              >
                {columns.map((column) => (
                  <MenuItem key={column} value={column}>
                    {column}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField
            fullWidth
            label="Condition (optionnelle)"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showJoin}
                onChange={(e) => setShowJoin(e.target.checked)}
                color="primary"
              />
            }
            label="Ajouter une jointure"
          />
          {showJoin && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel id="join-table-select-label">Table de jointure</InputLabel>
                <Select
                  labelId="join-table-select-label"
                  value={joinTable}
                  onChange={(e) => setJoinTable(e.target.value)}
                >
                  {tables.map((t) => (
                    <MenuItem key={t[`Tables_in_${dbSelect}`]} value={t[`Tables_in_${dbSelect}`]}>
                      {t[`Tables_in_${dbSelect}`]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {joinTableColumns.length > 0 && (
                <>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="join-condition-select-label">Condition de jointure</InputLabel>
                    <Select
                      labelId="join-condition-select-label"
                      value={joinCondition}
                      onChange={(e) => setJoinCondition(e.target.value)}
                    >
                      {joinTableColumns.map((column) => (
                        <MenuItem key={column} value={column}>
                          {column}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="join-columns-select-label">Colonnes de jointure</InputLabel>
                    <Select
                      labelId="join-columns-select-label"
                      multiple
                      value={joinColumns}
                      onChange={(e) => setJoinColumns(e.target.value)}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {columns.map((column) => (
                        <MenuItem key={column} value={column}>
                          {column}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}
            </>
          )}
          <TextField
            fullWidth
            label="Ordre de tri (optionnel)"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Limite de résultats (optionnel)"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            margin="normal"
          />
          {(operation === "INSERT" || operation === "UPDATE") && (
            <TextField
              fullWidth
              label="Valeurs (clé=valeur, séparées par des virgules)"
              value={values}
              onChange={(e) => setValues(e.target.value)}
              margin="normal"
            />
          )}
          <Button type="submit" variant="contained" color="primary">
            Générer la Requête SQL
          </Button>
        </form>
      </Container>
    </>
  );
};

export default GenerateSqlPage;
