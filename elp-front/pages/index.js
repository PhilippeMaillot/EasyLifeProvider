import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, FormGroup, FormControlLabel, Checkbox, Select, MenuItem, Box } from '@mui/material';
import Navbar from '../components/Navbar';

const Home = () => {
    const [projectName, setProjectName] = useState('');
    const [projectPath, setProjectPath] = useState('');
    const [host, setHost] = useState('');
    const [port, setPort] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [noPassword, setNoPassword] = useState(false);
    const [dbSelect, setDbSelect] = useState('');
    const [databases, setDatabases] = useState([]);
    const [tables, setTables] = useState([]);
    const [selectedTables, setSelectedTables] = useState([]);
    const [dependencies, setDependencies] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [savedPaths, setSavedPaths] = useState([]);

    useEffect(() => {
        fetchDatabases();
        fetchSavedPaths();
    }, []);

    const fetchDatabases = async () => {
        try {
            const response = await fetch('http://localhost:8080/db');
            const data = await response.json();
            setDatabases(data);
        } catch (error) {
            console.error('Error fetching databases:', error);
        }
    };

    const fetchTables = async () => {
        if (!dbSelect) return;
        try {
            const response = await fetch(`http://localhost:8080/db/${dbSelect}`);
            const data = await response.json();
            setTables(data);
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    const handleTableChange = (table) => {
        setSelectedTables((prev) =>
            prev.includes(table)
                ? prev.filter((t) => t !== table)
                : [...prev, table]
        );
    };

    const searchPackages = async (query) => {
        if (query.length < 3) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=${query}`);
            const data = await response.json();
            setSearchResults(data.objects);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const addDependency = (name) => {
        setDependencies((prev) => [...prev, name]);
    };

    const fetchSavedPaths = async () => {
        try {
            const response = await fetch('http://localhost:8080/directoryPath');
            const data = await response.json();
            setSavedPaths(data);
        } catch (error) {
            console.error('Error fetching saved paths:', error);
        }
    };

    const savePath = async () => {
        if (!projectPath) return;
        try {
            const response = await fetch('http://localhost:8080/directoryPath/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ path: projectPath })
            });

            if (response.status === 200) {
                fetchSavedPaths();
                alert('Path saved successfully!');
            } else {
                alert('There was an error saving the path.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error saving the path.');
        }
    };

    const deletePath = async (path) => {
        try {
            const response = await fetch('http://localhost:8080/directoryPath/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ path })
            });

            if (response.status === 200) {
                fetchSavedPaths();
                alert('Path deleted successfully!');
            } else {
                alert('There was an error deleting the path.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error deleting the path.');
        }
    };

    const submitForm = async (event) => {
        event.preventDefault();
        const extraDependencies = {};
        dependencies.forEach((name) => {
            extraDependencies[name] = '';
        });

        const body = {
            projectName,
            tableNames: selectedTables,
            dbConfig: { host, port: parseInt(port), user, password: noPassword ? '' : password, dbname: dbSelect },
            extraDependencies,
            projectPath
        };

        console.log('Body:', body)

        const confirmed = confirm('Do you want to create the project?');
        if (!confirmed) return;

        try {
            const response = await fetch('http://localhost:8080/process/zip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response.status === 200) {
                alert('Project created successfully!');
                window.location.reload();
            } else {
                alert('There was an error creating the project.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error creating the project.');
        }
    };

    return (
        <>
            <Navbar />
            <Container>
                <Typography variant="h3" gutterBottom>Create Project</Typography>
                <Box display="flex" justifyContent="space-between">
                    <form onSubmit={submitForm} style={{ width: '48%' }}>
                        <TextField fullWidth label="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
                        <TextField fullWidth label="Project Path" value={projectPath} onChange={(e) => setProjectPath(e.target.value)} />
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Save Path" onChange={savePath} />
                        </FormGroup>
                        <TextField fullWidth label="Host" value={host} onChange={(e) => setHost(e.target.value)} required />
                        <TextField fullWidth type="number" label="Port" value={port} onChange={(e) => setPort(e.target.value)} required />
                        <TextField fullWidth label="Username" value={user} onChange={(e) => setUser(e.target.value)} required />
                        <TextField
                            fullWidth
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={noPassword}
                        />
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={noPassword} onChange={(e) => {
                                    setNoPassword(e.target.checked);
                                    if (e.target.checked) {
                                        setPassword('');
                                    }
                                }} />}
                                label="No Password"
                            />
                        </FormGroup>
                        <Select fullWidth value={dbSelect} onChange={(e) => setDbSelect(e.target.value)} onClick={fetchTables} required>
                            {databases.map((db) => (
                                <MenuItem key={db.Database} value={db.Database}>{db.Database}</MenuItem>
                            ))}
                        </Select>
                        <Typography variant="h6">Selected Dependencies:</Typography>
                        <Box>
                            {dependencies.map((dep) => (
                                <Typography key={dep} variant="body1">{dep}</Typography>
                            ))}
                        </Box>
                        <Button type="submit" variant="contained" color="primary">Create Project</Button>
                    </form>
                    <Box width="48%">
                        <TextField fullWidth label="Search NPM Packages" value={searchInput} onChange={(e) => { setSearchInput(e.target.value); searchPackages(e.target.value); }} />
                        <Box>
                            {searchResults.map((result) => (
                                <Box key={result.package.name} onClick={() => addDependency(result.package.name)}>
                                    {result.package.name} ({result.package.version})
                                </Box>
                            ))}
                        </Box>
                        <Typography variant="h6">Saved Paths:</Typography>
                        <Box>
                            {savedPaths.map((path) => (
                                <Box key={path.path} display="flex" justifyContent="space-between" onClick={() => setProjectPath(path.path)}>
                                    <span>{path.path}</span>
                                    <Button variant="contained" color="secondary" onClick={() => deletePath(path.path)}>x</Button>
                                </Box>
                            ))}
                        </Box>
                        <Typography variant="h6">Tables:</Typography>
                        <Box>
                            {tables.map((table) => (
                                <FormControlLabel
                                    key={table[`Tables_in_${dbSelect}`]}
                                    control={<Checkbox
                                        checked={selectedTables.includes(table[`Tables_in_${dbSelect}`])}
                                        onChange={() => handleTableChange(table[`Tables_in_${dbSelect}`])}
                                    />}
                                    label={table[`Tables_in_${dbSelect}`]}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default Home;
