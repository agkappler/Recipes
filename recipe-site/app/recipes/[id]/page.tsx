import { RecipeForm } from "@/app/_components/recipes/RecipeForm";
import { ErrorMessage } from "@/app/_components/ui/ErrorMessage";
import RequestManager from "@/app/_helpers/RequestManager";
import RecipeModel from "@/app/_models/Recipe";
import { ChevronLeft } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import Error from "next/error";

interface RecipeProps {
    params: {
        id: string;
    };
}

export default async function Recipe({ params }: RecipeProps) {
    let recipeData: RecipeModel;
    try {
        recipeData = (await RequestManager.get(`/recipe/${params.id}`)) as RecipeModel;
    } catch (error: Error | any) {
        return <ErrorMessage errorMessage={error.message} />;
    }

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