import React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, useTheme } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
    const router = useRouter();
    const [value, setValue] = React.useState(0);
    const theme = useTheme();

    React.useEffect(() => {
        switch (router.pathname) {
            case '/':
                setValue(0);
                break;
            case '/uploads':
                setValue(1);
                break;
            case '/generateSqlPage':
                setValue(2);
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
        <AppBar position="sticky" sx={{ backgroundColor: theme.palette.primary.main }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Easy Life Provider
                </Typography>
                <Tabs 
                    value={value} 
                    onChange={handleChange} 
                    aria-label="nav tabs" 
                    textColor="inherit"
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'white',
                        },
                    }}
                >
                    <Tab label="Création de projet" component={Link} href="/" />
                    <Tab label="Uploads" component={Link} href="/uploads" />
                    <Tab label="Génération de requète SQL" component={Link} href="/generateSqlPage" />
                    <Tab label="Aide" component={Link} href="/aide" />
                </Tabs>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
