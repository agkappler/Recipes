'use client'

import Recipe from "@/app/_models/Recipe";
import { Box, Chip } from "@mui/material";
import { useRouter } from "next/navigation";
import { ImageBox } from "../ui/ImageBox";
import { ModelCard } from "../ui/ModelCard";

interface RecipeCardProps {
    recipeData: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipeData }) => {
    const router = useRouter();
    return <ModelCard title={recipeData.name} onClick={() => router.push(`/recipes/${recipeData.recipeId}`)}>
        {recipeData.avatarId && <>
            <ImageBox fileId={recipeData.avatarId} altText="Recipe image" />
        </>}
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1} mt={1}>
            <Chip label={`Prep Time: ${recipeData.prepTimeMinutes} min`} />
            <Chip label={`Cook Time: ${recipeData.cookTimeMinutes} min`} />
            {recipeData.totalCalories > 0 && <Chip label={`Total Calories: ${recipeData.totalCalories}`} />}
            {recipeData.quantity !== null && (
                <Chip
                    label={`Quantity Info: ${recipeData.quantity}`}
                    sx={{
                        height: 'auto',
                        '& .MuiChip-label': {
                            display: 'block',
                            whiteSpace: 'normal',
                        },
                    }}
                />
            )}
        </Box>
    </ModelCard>
}