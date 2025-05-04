import { RecipeForm } from "@/app/_components/recipes/RecipeForm";
import { ChevronLeft } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";

interface RecipeProps {
    params: {
        id: string;
    };
}

export default async function Recipe({ params }: RecipeProps) {
    const response = await fetch(`http://localhost:8080/api/recipe/${params.id}`);
    const recipeData = await response.json();
    return <>
        <Box className="flex items-center justify-between mt-2 w-full">
            <Button variant="text" startIcon={<ChevronLeft />} href="/recipes" className="float-left">
                All Recipes
            </Button>
            <Typography variant="h4">{recipeData.name}</Typography>
            <RecipeForm recipeData={recipeData} />
        </Box >
        <Box>
            <Typography variant="body1">Prep Time: {recipeData.prepTimeMinutes}</Typography>
            <Typography variant="body1">Cook Time: {recipeData.cookTimeMinutes}</Typography>
            <Typography variant="body1">Instructions: {recipeData.instructions}</Typography>
        </Box>
    </>;
}