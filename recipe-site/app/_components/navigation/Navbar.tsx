'use client'

import { Box, Button, Tab, Tabs } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';

export const Navbar: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname(); // Get the current URL path

    // Determine the active tab based on the current pathname
    const getTabValue = () => {
        if (pathname.startsWith('/recipes')) return 0;
        if (pathname.startsWith('/bounties')) return 1;
        if (pathname.startsWith('/dnd')) return 2;
        if (pathname.startsWith('/about')) return 3;
        if (pathname.startsWith('/login')) return 4;
        return false; // No tab selected for other routes
    };

    return (
        <nav className="bg-white shadow-md">
            <Box className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Button variant='text' onClick={() => router.push('/')} startIcon={<Image src="/mtn.png" alt="Mountain" width={25} height={25} />}>Fargopolis</Button>
                <Tabs value={getTabValue()}>
                    <Tab label="Recipes" onClick={() => router.push('/recipes')} />
                    <Tab label="Bounties" onClick={() => router.push('/bounties')} />
                    <Tab label="DnD" onClick={() => router.push('/dnd')} />
                    <Tab label="About" onClick={() => router.push('/about')} />
                    <Tab label="Login" onClick={() => router.push('/login')} />
                </Tabs>
            </Box>
        </nav>
    );
};

export default Navbar;