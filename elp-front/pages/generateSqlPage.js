import React, { useState, useEffect } from "react";
import {
  Container, Typography, TextField, Button, Select, MenuItem,
  FormControl, InputLabel, FormControlLabel, Checkbox, Box
} from "@mui/material";
import Navbar from "../components/Navbar";
import Head from "next/head";

const GenerateSqlPage = () => {
  const [table, setTable] = useState("");
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [condition, setCondition] = useState("");
  const [joinTable, setJoinTable] = useState("");
  const [joinType, setJoinType] = useState("INNER JOIN");
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
  const [distinct, setDistinct] = useState(false);
  const [top, setTop] = useState("");
  const [sumColumn, setSumColumn] = useState("");
  const [avgColumn, setAvgColumn] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const [having, setHaving] = useState("");
  const [unionTable, setUnionTable] = useState("");
  const [wildcard, setWildcard] = useState("");
  const [inCondition, setInCondition] = useState("");
  const [betweenCondition, setBetweenCondition] = useState("");
  const [alias, setAlias] = useState("");
  const [functionName, setFunctionName] = useState("");
  const [sql, setSql] = useState("");

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

  useEffect(() => {
    setSql(generateSql());
  }, [
    table, selectedColumns, condition, joinTable, joinType, joinCondition, orderBy, limit,
    distinct, top, sumColumn, avgColumn, groupBy, having, unionTable, wildcard,
    inCondition, betweenCondition, alias, functionName
  ]);

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
      console.log(data);
      const columnNames = data.map(col => col.Field);
      setColumnsCallback(columnNames);
    } catch (error) {
      console.error(`Erreur lors de la récupération des colonnes pour la table ${table}:`, error);
    }
  };

  const generateSql = () => {
    const columnsToSelect = selectedColumns.length > 0 ? selectedColumns.join(", ") : "*";
    let sql = `SELECT `;
    if (distinct) sql += "DISTINCT ";
    if (top) sql += `TOP ${top} `;
    sql += `${columnsToSelect}`;
    if (alias) sql += ` AS ${alias}`;
    sql += ` FROM ${table}`;

    if (showJoin && joinTable && joinCondition) {
      sql += ` ${joinType} ${joinTable} ON ${joinCondition}`;
    }
    if (condition) {
      sql += ` WHERE ${condition}`;
    }
    if (wildcard) {
      sql += condition ? ` AND ${wildcard}` : ` WHERE ${wildcard}`;
    }
    if (inCondition) {
      sql += condition || wildcard ? ` AND ${inCondition}` : ` WHERE ${inCondition}`;
    }
    if (betweenCondition) {
      sql += condition || wildcard || inCondition ? ` AND ${betweenCondition}` : ` WHERE ${betweenCondition}`;
    }
    if (groupBy) {
      sql += ` GROUP BY ${groupBy}`;
    }
    if (having) {
      sql += ` HAVING ${having}`;
    }
    if (orderBy) {
      sql += ` ORDER BY ${orderBy}`;
    }
    if (limit) {
      sql += ` LIMIT ${limit}`;
    }
    if (unionTable) {
      sql += ` UNION SELECT ${columnsToSelect} FROM ${unionTable}`;
    }
    if (sumColumn) {
      sql += `, SUM(${sumColumn})`;
    }
    if (avgColumn) {
      sql += `, AVG(${avgColumn})`;
    }

    return sql;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    alert(sql); // Affichez la requête SQL générée

    try {
      const response = await fetch('http://localhost:8080/sql/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dbName: dbSelect,
          functionName: functionName,
          sql: sql
        })
      });

      const data = await response.json();
      console.log(data); // Affichez la réponse de l'API
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la requête à l\'API:', error);
    }
  };

  return (
    <>
      <Head>
        <title>ELP - Select Custom</title>
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
          {columns.length > 0 && (
            <>
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
              <TextField
                fullWidth
                label="Somme (Colonne)"
                value={sumColumn}
                onChange={(e) => setSumColumn(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Moyenne (Colonne)"
                value={avgColumn}
                onChange={(e) => setAvgColumn(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Alias"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                margin="normal"
              />
            </>
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={distinct}
                onChange={(e) => setDistinct(e.target.checked)}
                color="primary"
              />
            }
            label="SELECT DISTINCT"
          />
          <TextField
            fullWidth
            label="Nom de la fonction"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Condition (WHERE)"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Wildcard"
            value={wildcard}
            onChange={(e) => setWildcard(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="IN Condition"
            value={inCondition}
            onChange={(e) => setInCondition(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="BETWEEN Condition"
            value={betweenCondition}
            onChange={(e) => setBetweenCondition(e.target.value)}
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
                <InputLabel id="join-type-select-label">Type de jointure</InputLabel>
                <Select
                  labelId="join-type-select-label"
                  value={joinType}
                  onChange={(e) => setJoinType(e.target.value)}
                >
                  <MenuItem value="INNER JOIN">INNER JOIN</MenuItem>
                  <MenuItem value="LEFT JOIN">LEFT JOIN</MenuItem>
                  <MenuItem value="RIGHT JOIN">RIGHT JOIN</MenuItem>
                  <MenuItem value="FULL JOIN">FULL JOIN</MenuItem>
                  <MenuItem value="SELF JOIN">SELF JOIN</MenuItem>
                </Select>
              </FormControl>
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
              )}
            </>
          )}
          <TextField
            fullWidth
            label="Ordre de tri (ORDER BY)"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Limite de résultats (LIMIT)"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="TOP"
            value={top}
            onChange={(e) => setTop(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Group By"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Having"
            value={having}
            onChange={(e) => setHaving(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Union Table"
            value={unionTable}
            onChange={(e) => setUnionTable(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            Générer la Requête SQL
          </Button>
        </form>
        <Box mt={4}>
          <Typography variant="h6">Requête SQL générée:</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={sql}
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>
      </Container>
    </>
  );
};

export default GenerateSqlPage;
