import React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
    const router = useRouter();
    const [value, setValue] = React.useState(0);

    React.useEffect(() => {
        switch (router.pathname) {
            case '/':
                setValue(0);
                break;
            case '/uploads':
                setValue(1);
                break;
            case '/aide':
                setValue(3);
                break;
            default:
                setValue(false);
                break;
        }
    }, [router.pathname]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <AppBar position="sticky" sx={{ backgroundColor: "#283747" }}>
            <Toolbar>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        flexGrow: 1, 
                        fontWeight: 'bold',
                        fontFamily: 'Handjet, sans-serif', // Appliquer la police Handjet
                    }}
                >
                    QuickAPI
                </Typography>
                <Tabs 
                    value={value} 
                    onChange={handleChange} 
                    aria-label="nav tabs" 
                    textColor="inherit"
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#5D6D7E',
                        },
                        fontFamily: 'Handjet, sans-serif', // Appliquer la police Handjet aux onglets
                    }}
                >
                    <Tab label="Création de projet" component={Link} href="/" />
                    <Tab label="Uploads" component={Link} href="/uploads" />
                    <Tab label="Aide" component={Link} href="/aide" />
                </Tabs>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
