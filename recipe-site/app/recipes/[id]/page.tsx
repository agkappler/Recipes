'use client';

import { IngredientList } from "@/app/_components/recipes/IngredientList";
import { RecipeForm } from "@/app/_components/recipes/RecipeForm";
import { RecipeSteps } from "@/app/_components/recipes/RecipeSteps";
import { LinkButton } from "@/app/_components/ui/buttons/LinkButton";
import { ErrorMessage } from "@/app/_components/ui/ErrorMessage";
import { ImageBox } from "@/app/_components/ui/ImageBox";
import { LoadingSpinner } from "@/app/_components/ui/LoadingSpinner";
import { LoadingWrapper } from "@/app/_components/ui/LoadingWrapper";
import { PageHeader } from "@/app/_components/ui/PageHeader";
import RequestManager from "@/app/_helpers/RequestManager";
import SlugProps from "@/app/_helpers/SlugProps";
import Recipe from "@/app/_models/Recipe";
import { Edit } from "@mui/icons-material";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";

export default function RecipePage({ params }: SlugProps) {
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => {
        setIsOpen(false);
    }

    const { data: recipeData, error, isLoading, mutate } = useSWR<Recipe>(`/recipe/${params.id}`, () => RequestManager.get<Recipe>(`/recipe/${params.id}`));
    if (error) {
        return <ErrorMessage errorMessage={error.message} />;
    }
    if (recipeData === undefined) {
        return <LoadingSpinner />
    }

    return <LoadingWrapper isLoading={isLoading} message="Loading recipe data...">
        <PageHeader
            title={recipeData.name}
            leftContainer={<LinkButton label="All Recipes" url="/recipes" isForward={false} />}
            rightContainer={<IconButton size="medium" aria-label="edit" onClick={() => setIsOpen(true)}><Edit /></IconButton>}
        />
        {recipeData.avatarId && <>
            <ImageBox fileId={recipeData.avatarId} altText="Recipe image" />
        </>}
        <Box className="p-2">
            <Box display="flex" justifyContent="center" gap={2} mb={2}>
                <Chip label={`Prep Time: ${recipeData.prepTimeMinutes} min`} />
                <Chip label={`Cook Time: ${recipeData.cookTimeMinutes} min`} />
                <Chip label={`Total Calories: ${recipeData.totalCalories ?? "TBD"}`} />
                <Chip label={`Quantity: ${recipeData.quantity ?? "TBD"}`} />
            </Box>
            {recipeData.description && (
                <Box border={1} padding={2} borderRadius={4}>
                    <Typography variant="h6" textAlign="center">Description</Typography>
                    <Typography variant="body1">{recipeData.description}</Typography>
                </Box>
            )}
            <RecipeSteps recipeId={Number(params.id)} />
            <IngredientList recipeId={recipeData.recipeId} />
        </Box>
        <RecipeForm
            isOpen={isOpen}
            onClose={onClose}
            recipeData={recipeData}
            updateRecipe={mutate}
        />
    </LoadingWrapper>;
}