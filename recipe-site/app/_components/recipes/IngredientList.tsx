'use client'

import Ingredient from "@/app/_models/Ingredient";
import { Add, Edit } from "@mui/icons-material";
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";
import { IngredientForm } from "./IngredientForm";

interface IngredientListProps {
    recipeId: number;
    ingredients: Ingredient[];
    updateIngredients: () => void;
}

export const IngredientList: React.FC<IngredientListProps> = ({ recipeId, ingredients, updateIngredients }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | undefined>(undefined);
    const onClose = () => {
        setIsOpen(false);
        setSelectedIngredient(undefined);
    }

    return <>
        <Box>
            <Box className="flex items-center justify-between mt-2 w-full">
                <Typography variant="h6">Ingredients</Typography>
                <Button variant='text' onClick={() => setIsOpen(!isOpen)} startIcon={<Add />}>Add Ingredient</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table aria-label="ingredient table">
                    <TableHead>
                        <TableRow className="font-bold">
                            <TableCell>Name</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="center">Calories</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ingredients.map((ingredient, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{ingredient.name}</TableCell>
                                <TableCell align="center">{ingredient.quantity}</TableCell>
                                <TableCell align="center">{ingredient.calories}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => {
                                        setSelectedIngredient(ingredient);
                                        setIsOpen(true);
                                    }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        {isOpen && <IngredientForm
            recipeId={recipeId}
            isOpen={isOpen}
            onClose={onClose}
            ingredient={selectedIngredient}
            updateIngredients={updateIngredients}
        />}
    </>
}