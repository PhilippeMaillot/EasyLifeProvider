import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  Box,
  Chip,
  Paper,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Head from "next/head";
import Popup from "../components/Popup"; // Importation du composant Popup
import CustomTextField from "../components/CustomTextField"; // Importation du composant CustomTextField

const Home = () => {
  const [projectName, setProjectName] = useState("");
  const [projectPath, setProjectPath] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [noPassword, setNoPassword] = useState(false);
  const [dbSelect, setDbSelect] = useState("");
  const [databases, setDatabases] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [savedPaths, setSavedPaths] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false); // État pour gérer le popup
  const [popupMessage, setPopupMessage] = useState(""); // Message du popup
  const searchInputRef = useRef(null);
  const [searchResultsPosition, setSearchResultsPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    fetchDatabases();
    fetchSavedPaths();
  }, []);

  useEffect(() => {
    fetchTables();
  }, [dbSelect]);

  const fetchDatabases = async () => {
    try {
      const response = await fetch("http://localhost:8080/db");
      const data = await response.json();
      setDatabases(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des bases de données:",
        error
      );
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

  const handleTableChange = (table) => {
    setSelectedTables((prev) =>
      prev.includes(table) ? prev.filter((t) => t !== table) : [...prev, table]
    );
  };

  const searchPackages = async (query) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(
        `https://registry.npmjs.org/-/v1/search?text=${query}`
      );
      const data = await response.json();
      setSearchResults(data.objects);
      if (searchInputRef.current) {
        const rect = searchInputRef.current.getBoundingClientRect();
        setSearchResultsPosition({ top: rect.bottom, left: rect.left });
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const addDependency = (name) => {
    setDependencies((prev) => {
      if (!prev.includes(name)) {
        return [...prev, name];
      }
      return prev;
    });
    setSearchInput("");
    setSearchResults([]);
  };

  const removeDependency = (name) => {
    setDependencies((prev) => prev.filter((dep) => dep !== name));
  };

  const fetchSavedPaths = async () => {
    try {
      const response = await fetch("http://localhost:8080/directoryPath");
      const data = await response.json();
      setSavedPaths(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des chemins enregistrés:",
        error
      );
    }
  };

  // Fonction de validation des champs
  const validateForm = () => {
    if (
      !projectName ||
      !host ||
      !port ||
      !user ||
      (!password && !noPassword) ||
      !dbSelect
    ) {
      setPopupMessage("Veuillez remplir tous les champs obligatoires.");
      setPopupOpen(true);
      return false;
    }
    return true;
  };

  const submitForm = async (event) => {
    event.preventDefault();

    // Valider les champs avant l'envoi
    if (!validateForm()) return;

    const extraDependencies = {};
    dependencies.forEach((name) => {
      extraDependencies[name] = "";
    });

    const body = {
      projectName,
      tableNames: selectedTables,
      dbConfig: {
        host,
        port: parseInt(port),
        user,
        password: noPassword ? "" : password,
        dbname: dbSelect,
      },
      extraDependencies,
      projectPath,
    };

    const confirmed = confirm(
      `Voulez-vous créer le projet ${body.projectName} ?` +
        `\n\nTables sélectionnées : ${body.tableNames.join(", ")}` +
        `\n\nBase de données : ${body.dbConfig.dbname}` +
        `\n\nDépendances supplémentaires : ${Object.keys(
          body.extraDependencies
        ).join(", ")}` +
        `\n\nChemin du projet : ${body.projectPath}` +
        `\n\nConfiguration de la base de données :` +
        `\nHôte : ${body.dbConfig.host}` +
        `\nPort : ${body.dbConfig.port}` +
        `\nNom d'utilisateur : ${body.dbConfig.user}` +
        `\nMot de passe : ${body.dbConfig.password}`
    );
    if (!confirmed) return;

    try {
      const response = await fetch("http://localhost:8080/process/zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.status === 200) {
        alert("Projet créé avec succès!");
        window.location.reload();
      } else {
        alert("Il y a eu une erreur lors de la création du projet.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Il y a eu une erreur lors de la création du projet.");
    }
  };

  return (
    <>
      <Head>
        <title>ELP - Création de projet</title>
      </Head>
      <Navbar />
      <Container maxWidth="md">
        <br />
        <Box
          display="flex"
          flexDirection={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          sx={{
            padding: {
              xs: "10px",
              sm: "20px",
            },
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
          >
            Créer un projet
          </Typography>
          <Button
            type="submit"
            variant="contained"
            onClick={submitForm}
            sx={{
              fontSize: {
                xs: "0.8rem",
                sm: "1rem",
              },
              padding: {
                xs: "6px 12px",
                sm: "10px 20px",
              },
              backgroundColor: "#34495E",
              "&:hover": {
                backgroundColor: "#283747",
              },
            }}
          >
            Créer un projet
          </Button>
        </Box>
        <Box display="flex" justifyContent="space-between">
          {/* Première colonne */}
          <form
            onSubmit={submitForm}
            style={{ width: "100%", maxWidth: "48%" }}
          >
            <CustomTextField
              label="Nom du projet"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
            <CustomTextField
              label="Chemin du projet"
              value={projectPath}
              onChange={(e) => setProjectPath(e.target.value)}
            />
            <CustomTextField
              label="Hôte"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              required
            />
            <CustomTextField
              label="Port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              type="number"
              required
            />
            <CustomTextField
              label="Nom d'utilisateur"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
            <CustomTextField
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              disabled={noPassword}
            />
            <FormGroup sx={{ mb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={noPassword}
                    onChange={(e) => {
                      setNoPassword(e.target.checked);
                      if (e.target.checked) {
                        setPassword("");
                      }
                    }}
                  />
                }
                label="Pas de mot de passe"
              />
            </FormGroup>
            <Select
              fullWidth
              value={dbSelect}
              onChange={(e) => setDbSelect(e.target.value)}
              required
              sx={{ mb: 1 }}
            >
              {databases.map((db) => (
                <MenuItem key={db.Database} value={db.Database}>
                  {db.Database}
                </MenuItem>
              ))}
            </Select>
          </form>

          {/* Deuxième colonne */}
          <Box width="100%" maxWidth="48%">
            <TextField
              fullWidth
              label="Rechercher des packages NPM"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                searchPackages(e.target.value);
              }}
              inputRef={searchInputRef}
              sx={{ mb: 1, fontSize: "0.8rem" }}
            />
            <Box mt={2} mb={2} p={2} border={1} borderColor="grey.300">
              <Typography variant="h6">Dépendances sélectionnées:</Typography>
              <Box display="flex" flexWrap="wrap">
                {dependencies.map((dep) => (
                  <Chip
                    key={dep}
                    label={dep}
                    onDelete={() => removeDependency(dep)}
                    color="primary"
                    style={{ margin: "2px" }}
                  />
                ))}
              </Box>
            </Box>
            <Box mt={2} mb={2} p={2} border={1} borderColor="grey.300">
              <Typography variant="h6">Chemins enregistrés:</Typography>
              <Box>
                {savedPaths.map((path) => (
                  <Box
                    key={path.path}
                    onClick={() => setProjectPath(path.path)}
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      margin: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {path.path}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box
              mt={2}
              mb={2}
              p={2}
              border={1}
              borderColor="grey.300"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              <Typography variant="h6">Tables:</Typography>
              <Box>
                {tables.map((table) => (
                  <FormControlLabel
                    key={table[`Tables_in_${dbSelect}`]}
                    control={
                      <Checkbox
                        checked={selectedTables.includes(
                          table[`Tables_in_${dbSelect}`]
                        )}
                        onChange={() =>
                          handleTableChange(table[`Tables_in_${dbSelect}`])
                        }
                      />
                    }
                    label={table[`Tables_in_${dbSelect}`]}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
        {searchResults.length > 0 && (
          <Paper
            style={{
              position: "absolute",
              top: `${searchResultsPosition.top}px`,
              left: `${searchResultsPosition.left}px`,
              width: "45%",
              maxHeight: "400px",
              overflowY: "auto",
              zIndex: 1000,
              padding: "10px",
            }}
          >
            {searchResults.map((result) => (
              <Box
                key={result.package.name}
                onClick={() => addDependency(result.package.name)}
                style={{
                  borderBottom: "1px solid #ccc",
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                {result.package.name} ({result.package.version})
              </Box>
            ))}
          </Paper>
        )}
      </Container>

      <Popup
        open={popupOpen}
        handleClose={() => setPopupOpen(false)}
        message={popupMessage}
      />
      <br />
    </>
  );
};

export default Home;
