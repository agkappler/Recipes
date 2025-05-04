'use client'

import Recipe from "@/app/_models/Recipe";
import { Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

interface RecipeCardProps {
    recipeData: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipeData }) => {
    const router = useRouter();
    return <Paper elevation={3} className="m-2 p-2" role="button" onClick={() => router.push(`/recipes/${recipeData.recipeId}`)}>
        <Typography variant="h6">{recipeData.name}</Typography>
        <Typography variant="body1">Prep Time: {recipeData.prepTimeMinutes}</Typography>
        <Typography variant="body1">Cook Time: {recipeData.cookTimeMinutes}</Typography>
        <Typography variant="body1">Instructions: {recipeData.instructions}</Typography>
    </Paper>
}