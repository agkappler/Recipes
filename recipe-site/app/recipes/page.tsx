'use client';

import { Box, Grid } from '@mui/material';
import { useState } from 'react';
import useSWR from 'swr';
import { RecipeCard } from '../_components/recipes/RecipeCard';
import { RecipeForm } from '../_components/recipes/RecipeForm';
import { AddModelCard } from '../_components/ui/AddModelCard';
import { ErrorMessage } from '../_components/ui/ErrorMessage';
import { LoadingSpinner } from '../_components/ui/LoadingSpinner';
import { PageHeader } from '../_components/ui/PageHeader';
import RequestManager from '../_helpers/RequestManager';
import Recipe from '../_models/Recipe';

export default function Recipes() {
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => {
        setIsOpen(false);
    }

    const { data: recipes, error, isLoading, mutate } = useSWR<Recipe[]>('/recipes', () => RequestManager.get('/recipes'));
    if (isLoading) {
        return <LoadingSpinner message="Loading recipes..." />;
    }
    if (error || recipes === undefined) {
        return <ErrorMessage errorMessage={error.message} />;
    }

    // Possible header color: headerColor="#FFDF8E"
    return (<>
        <PageHeader title="All Recipes" />
        <Box className="px-2">
            <Grid container spacing={1}>
                <Grid size={4}>
                    <AddModelCard
                        onClick={() => setIsOpen(true)}
                        title={'Add Recipe'}
                    />
                </Grid>
                {recipes.map(r => (
                    <Grid size={4} key={r.recipeId}>
                        <RecipeCard recipeData={r} />
                    </Grid>
                ))}
            </Grid>
        </Box>
        <RecipeForm
            isOpen={isOpen}
            onClose={onClose}
            recipeData={undefined}
            updateRecipe={mutate}
        />
    </>);
}