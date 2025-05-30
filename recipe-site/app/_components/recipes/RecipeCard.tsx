'use client'

import Recipe from "@/app/_models/Recipe";
import { Box, Chip, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { ModelCard } from "../ui/ModelCard";

interface RecipeCardProps {
    recipeData: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipeData }) => {
    const router = useRouter();
    return <ModelCard title={recipeData.name} onClick={() => router.push(`/recipes/${recipeData.recipeId}`)}>
        <Box display="flex" justifyContent="center" gap={2}>
            <Chip label={`Prep Time: ${recipeData.prepTimeMinutes} min`} />
            <Chip label={`Cook Time: ${recipeData.cookTimeMinutes} min`} />
        </Box>
        <Typography variant="body1">Instructions: {recipeData.instructions}</Typography>
    </ModelCard>
}