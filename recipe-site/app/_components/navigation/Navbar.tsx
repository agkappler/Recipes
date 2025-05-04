'use client'

import { Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

export const Navbar: React.FC = () => {
    const router = useRouter();

    return (
        <nav className="bg-white shadow-md">
            <Box className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Button variant='text' onClick={() => router.push('/')}>Fargopolis</Button>
                <ul className="flex space-x-6">
                    <li>
                        <a href="/recipes">Recipes</a>
                    </li>
                    <li>
                        <a href="/about">About</a>
                    </li>
                </ul>
            </Box>
        </nav>
    );
};

export default Navbar;