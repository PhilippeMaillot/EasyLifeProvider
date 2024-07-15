import React from 'react';
import { Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';

const Page2 = () => {
    return (
        <>
            <Navbar />
            <Container>
                <Typography variant="h4" gutterBottom>Page 2</Typography>
                <Typography variant="body1">This is Page 2.</Typography>
            </Container>
        </>
    );
};

export default Page2;
