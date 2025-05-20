'use client';

import { Box, Grid, Typography } from '@mui/material';
import useSWR from 'swr';
import { RecipeCard } from '../_components/recipes/RecipeCard';
import { RecipeForm } from '../_components/recipes/RecipeForm';
import { ErrorMessage } from '../_components/ui/ErrorMessage';
import { PageHeader } from '../_components/ui/PageHeader';
import RequestManager from '../_helpers/RequestManager';
import Recipe from '../_models/Recipe';
import { LoadingSpinner } from '../_components/ui/LoadingSpinner';

export default function Recipes() {
    // const { data: recipes, error, isLoading, mutate } = useSWR<Recipe[]>('/recipes', () => RequestManager.get('/recipes'));
    // if (isLoading) {
    //     return <LoadingSpinner message="Loading recipes..." />;
    // }
    // if (error || recipes === undefined) {
    //     return <ErrorMessage errorMessage={error.message} />;
    // }

    const recipes = [] as Recipe[],
        mutate = () => { };

    return (
        <Box className="mx-2">
            <PageHeader title="All Recipes" rightContainer={<RecipeForm recipeData={undefined} updateRecipe={mutate} />} />
            <Grid container spacing={1}>
                {recipes.map(r => (
                    <Grid size={6} key={r.recipeId}>
                        <RecipeCard recipeData={r} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}