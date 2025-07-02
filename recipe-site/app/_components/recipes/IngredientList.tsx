'use client'

import Ingredient from "@/app/_models/Ingredient";
import { Add, Edit } from "@mui/icons-material";
import { Box, Button, Chip, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";
import { IngredientForm } from "./IngredientForm";
import useSWR from "swr";
import RequestManager from "@/app/_helpers/RequestManager";
import { LoadingWrapper } from "../ui/LoadingWrapper";

interface IngredientListProps {
    recipeId: number;
}

export const IngredientList: React.FC<IngredientListProps> = ({ recipeId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | undefined>(undefined);
    const onClose = () => {
        setIsOpen(false);
        setSelectedIngredient(undefined);
    }

    const { data: ingredients, isLoading: loadingIngredients, mutate: updateIngredients } = useSWR<Ingredient[]>(
        `/ingredientsForRecipe/${recipeId}`,
        () => RequestManager.get<Ingredient[]>(`/ingredientsForRecipe/${recipeId}`)
    );

    return <LoadingWrapper isLoading={loadingIngredients} message="Loading Ingredients...">
        <Box>
            <Box className="flex items-center justify-between mt-2 w-full">
                <Typography variant="h6">Ingredients</Typography>
                <Chip label={`Calories from Ingredients: ${ingredients?.reduce((total, ingredient) => total + (ingredient.calories || 0), 0) ?? 0}`} />
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
                        {ingredients?.map((ingredient, index) => (
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
    </LoadingWrapper>
}