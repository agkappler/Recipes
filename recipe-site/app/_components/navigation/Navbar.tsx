'use client'

import { NAVBAR_BREAK } from '@/app/_constants/Media';
import { Menu } from '@mui/icons-material';
import { Box, Button, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Tab, Tabs, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

export const Navbar: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname(); // Get the current URL path

    const isMobile = useMediaQuery(`(max-width:${NAVBAR_BREAK})`);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navItems = [
        { label: "Recipes", path: "/recipes" },
        { label: "Bounties", path: "/bounties" },
        { label: "DnD", path: "/dnd" },
        { label: "About", path: "/about" },
        { label: "Split Check", path: "/split-check" },
        { label: "Login", path: "/login" },
    ];

    // Determine the active tab based on the current pathname
    const getTabValue = () => {
        if (pathname.startsWith('/recipes')) return 0;
        if (pathname.startsWith('/bounties')) return 1;
        if (pathname.startsWith('/dnd')) return 2;
        if (pathname.startsWith('/about')) return 3;
        if (pathname.startsWith('/split-check')) return 4;
        if (pathname.startsWith('/login')) return 5;
        return false; // No tab selected for other routes
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-10">
            <Box className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Button variant='text' onClick={() => router.push('/')} startIcon={<Image src="/mtn.png" alt="Mountain" width={25} height={25} />}>Fargopolis</Button>
                {isMobile ? (
                    <>
                        <IconButton onClick={() => setDrawerOpen(true)} size="large">
                            <Menu />
                        </IconButton>
                        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                            <Box sx={{ width: 200 }} role="presentation" onClick={() => setDrawerOpen(false)}>
                                <List>
                                    {navItems.map((item) => (
                                        <ListItem key={item.label} disablePadding>
                                            <ListItemButton onClick={() => router.push(item.path)}>
                                                <ListItemText primary={item.label} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Drawer>
                    </>
                ) : (
                    <Tabs value={getTabValue()} style={{ display: 'flex', flexWrap: 'wrap' }} textColor="primary" indicatorColor="primary">
                        {navItems.map((item) => (
                            <Tab key={item.label} label={item.label} onClick={() => router.push(item.path)} />
                        ))}
                    </Tabs>
                )}
            </Box>
        </nav>
    );
};

export default Navbar;