'use client'

import Recipe from "@/app/_models/Recipe";
import { Box, Chip, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

interface RecipeCardProps {
    recipeData: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipeData }) => {
    const router = useRouter();
    return <Paper elevation={3} className="p-2 h-full text-center" role="button" onClick={() => router.push(`/recipes/${recipeData.recipeId}`)}>
        <Typography variant="h6">{recipeData.name}</Typography>
        <Box display="flex" justifyContent="center" gap={2}>
            <Chip label={`Prep Time: ${recipeData.prepTimeMinutes} min`} />
            <Chip label={`Cook Time: ${recipeData.cookTimeMinutes} min`} />
        </Box>
        <Typography variant="body1">Instructions: {recipeData.instructions}</Typography>
    </Paper>
}