'use client'

import { Edit } from "@mui/icons-material"
import { DialogContent, IconButton, Modal, Paper, Typography } from "@mui/material"
import { useState } from "react";
import { RecipeForm } from "./RecipeForm";

export const RecipeCard: React.FC<any> = ({ recipeData }) => {
    const [isOpen, setIsOpen] = useState(false);

    return <>
        <Paper elevation={3} className="m-2 p-2">
            <Typography variant="h4">{recipeData.name}</Typography>
            <Typography variant="body1">Prep Time: {recipeData.prepTimeMinutes}</Typography>
            <Typography variant="body1">Cook Time: {recipeData.cookTimeMinutes}</Typography>
            <Typography variant="body1">Instructions: {recipeData.instructions}</Typography>
            <IconButton aria-label="edit" onClick={() => setIsOpen(!isOpen)}><Edit /></IconButton>
        </Paper>
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <DialogContent>
                <Paper elevation={3} className="m-2 p-2">
                    <RecipeForm recipeData={recipeData} onClose={() => setIsOpen(false)} />
                </Paper>
            </DialogContent>
        </Modal>
    </>
}