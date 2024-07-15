import React from 'react';
import { Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';

const Page1 = () => {
    return (
        <>
            <Navbar />
            <Container>
                <Typography variant="h4" gutterBottom>Page 1</Typography>
                <Typography variant="body1">This is Page 1.</Typography>
            </Container>
        </>
    );
};

export default Page1;
