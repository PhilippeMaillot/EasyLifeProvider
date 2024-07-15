import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import Navbar from '../components/Navbar';

const Uploads = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await fetch('http://localhost:8080/uploads/get');
            const data = await response.json();
            setFiles(data);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const handleDownload = (fileName) => {
        const link = document.createElement('a');
        link.href = `http://localhost:8080/uploads/zips/${fileName}`;
        link.download = fileName;
        link.click();
    };

    return (
        <>
            <Navbar />
            <Container>
                <Typography variant="h4" gutterBottom>Uploads</Typography>
                <Box>
                    {files.map((file, index) => (
                        <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="body1">{file}</Typography>
                            <Button variant="contained" color="primary" onClick={() => handleDownload(file)}>
                                Download
                            </Button>
                        </Box>
                    ))}
                </Box>
            </Container>
        </>
    );
};

export default Uploads;
