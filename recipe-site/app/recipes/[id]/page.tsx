'use client'
import { IngredientList } from "@/app/_components/recipes/IngredientList";
import { RecipeForm } from "@/app/_components/recipes/RecipeForm";
import { ErrorMessage } from "@/app/_components/ui/ErrorMessage";
import { LinkButton } from "@/app/_components/ui/LinkButton";
import { LoadingSpinner } from "@/app/_components/ui/LoadingSpinner";
import { PageHeader } from "@/app/_components/ui/PageHeader";
import RequestManager from "@/app/_helpers/RequestManager";
import SlugProps from "@/app/_helpers/SlugProps";
import RecipeModel from "@/app/_models/Recipe";
import { Box, Typography } from "@mui/material";
import useSWR from "swr";

export default function Recipe({ params }: SlugProps) {
    // const { data: recipeData, error, isLoading, mutate } = useSWR<RecipeModel>(`/recipe/${params.id}`, () => RequestManager.get(`/recipe/${params.id}`));
    // if (isLoading) {
    //     return <LoadingSpinner message="Loading recipe data..." />;
    // }
    // if (error || recipeData === undefined) {
    //     return <ErrorMessage errorMessage={error.message} />;
    // }

    const recipeData = {} as RecipeModel,
        mutate = () => { };

    if (recipeData === undefined || recipeData.name === undefined) {
        return <LoadingSpinner message="Loading recipe data..." />;
    }

    return <>
        <PageHeader
            title={recipeData.name}
            leftContainer={<LinkButton label="All Recipes" url="/recipes" isForward={false} />}
            rightContainer={<RecipeForm recipeData={recipeData} updateRecipe={mutate} />}
        />
        <Box className="m-2 p-2">
            <Typography variant="body1">Prep Time: {recipeData.prepTimeMinutes}</Typography>
            <Typography variant="body1">Cook Time: {recipeData.cookTimeMinutes}</Typography>
            <Typography variant="body1">Instructions: {recipeData.instructions}</Typography>
            <IngredientList recipeId={recipeData.recipeId} />
        </Box>
    </>;
}