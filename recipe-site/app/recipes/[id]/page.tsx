'use client'
import { IngredientList } from "@/app/_components/recipes/IngredientList";
import { RecipeForm } from "@/app/_components/recipes/RecipeForm";
import { LinkButton } from "@/app/_components/ui/buttons/LinkButton";
import { ErrorMessage } from "@/app/_components/ui/ErrorMessage";
import { LoadingSpinner } from "@/app/_components/ui/LoadingSpinner";
import { LoadingWrapper } from "@/app/_components/ui/LoadingWrapper";
import { PageHeader } from "@/app/_components/ui/PageHeader";
import RequestManager from "@/app/_helpers/RequestManager";
import SlugProps from "@/app/_helpers/SlugProps";
import Ingredient from "@/app/_models/Ingredient";
import RecipeModel from "@/app/_models/Recipe";
import { Edit } from "@mui/icons-material";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";

export default function Recipe({ params }: SlugProps) {
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => {
        setIsOpen(false);
    }
    const { data: recipeData, error, isLoading, mutate } = useSWR<RecipeModel>(`/recipe/${params.id}`, () => RequestManager.get(`/recipe/${params.id}`));
    const { data: ingredients, isLoading: loadingIngredients, mutate: updateIngredients } = useSWR<Ingredient[]>(`/ingredientsForRecipe/${params.id}`, () => RequestManager.get(`/ingredientsForRecipe/${params.id}`));
    if (isLoading) {
        return <LoadingSpinner message="Loading recipe data..." />;
    }
    if (error || recipeData === undefined) {
        return <ErrorMessage errorMessage={error.message} />;
    }

    return <>
        <PageHeader
            title={recipeData.name}
            leftContainer={<LinkButton label="All Recipes" url="/recipes" isForward={false} />}
            rightContainer={<IconButton size="medium" aria-label="edit" onClick={() => setIsOpen(true)}><Edit /></IconButton>}
        />
        <Box className="p-2">
            <Box display="flex" justifyContent="center" gap={2} mb={2}>
                <Chip label={`Prep Time: ${recipeData.prepTimeMinutes} min`} />
                <Chip label={`Cook Time: ${recipeData.cookTimeMinutes} min`} />
                <Chip label={`Total Calories: ${ingredients?.reduce((total, ingredient) => total + (ingredient.calories || 0), 0) ?? 0}`} />
            </Box>
            <Box border={1} padding={2} borderRadius={4}>
                <Typography variant="h6" textAlign="center">Instructions</Typography>
                <Typography variant="body1">{recipeData.instructions}</Typography>
            </Box>
            <LoadingWrapper isLoading={loadingIngredients} message="Loading Ingredients...">
                <IngredientList
                    recipeId={recipeData.recipeId}
                    ingredients={ingredients ?? []}
                    updateIngredients={updateIngredients}
                />
            </LoadingWrapper>
        </Box>
        <RecipeForm
            isOpen={isOpen}
            onClose={onClose}
            recipeData={recipeData}
            updateRecipe={mutate}
        />
    </>;
}