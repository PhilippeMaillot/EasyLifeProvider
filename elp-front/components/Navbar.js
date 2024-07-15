import React from 'react';
import { AppBar, Toolbar, Typography, Button, Tabs, Tab } from '@mui/material';
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
            case '/page1':
                setValue(2);
                break;
            case '/page2':
                setValue(3);
                break;
            default:
                setValue(0);
                break;
        }
    }, [router.pathname]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    My Application
                </Typography>
                <Tabs value={value} onChange={handleChange} aria-label="nav tabs">
                    <Tab label="Create Project" component={Link} href="/" />
                    <Tab label="Uploads" component={Link} href="/uploads" />
                    <Tab label="Page 1" component={Link} href="/page1" />
                    <Tab label="Page 2" component={Link} href="/page2" />
                </Tabs>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
