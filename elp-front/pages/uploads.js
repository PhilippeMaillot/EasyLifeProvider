import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box, Divider } from "@mui/material";
import { Download as DownloadIcon } from '@mui/icons-material'; // Importer l'icône de téléchargement
import Navbar from "../components/Navbar";
import Head from "next/head";

const Uploads = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://localhost:8080/uploads/get");
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleDownload = (fileName) => {
    const link = document.createElement("a");
    link.href = `http://localhost:8080/uploads/zips/${fileName}`;
    link.download = fileName;
    link.click();
  };

  return (
    <>
      <Head>
        <title>ELP - Uploads</title>
      </Head>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Uploads
        </Typography>
        <Box sx={{ backgroundColor: '#F9F9F9', p: 2, borderRadius: 2 }}>
          {files.map((file, index) => (
            <Box key={index}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body1">{file}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDownload(file)}
                  startIcon={<DownloadIcon />}
                >
                  téléchargement
                </Button>
              </Box>
              {index < files.length - 1 && <Divider sx={{ my: 2, borderColor: 'grey.800' }} />}
            </Box>
          ))}
        </Box>
      </Container>
    </>
  );
};

export default Uploads;
