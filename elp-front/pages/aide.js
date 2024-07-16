import React from 'react';
import { Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import Head from 'next/head';

const Aide = () => {
    return (
        <>
            <Head>
                <title>ELP - Aide</title>
            </Head>
            <Navbar />
            <br />
            <Container>
                <Typography variant="h4" gutterBottom>Aide</Typography>
                <Typography variant="body1">Page d'aide, à venir.</Typography>
            </Container>
        </>
    );
};

export default Aide;
