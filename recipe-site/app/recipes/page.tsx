'use client';

import { Box, Grid } from '@mui/material';
import { useState } from 'react';
import useSWR from 'swr';
import { RecipeCard } from '../_components/recipes/RecipeCard';
import { RecipeForm } from '../_components/recipes/RecipeForm';
import { AddModelCard } from '../_components/ui/AddModelCard';
import { LinkButton } from '../_components/ui/buttons/LinkButton';
import { ErrorMessage } from '../_components/ui/ErrorMessage';
import { LoadingSpinner } from '../_components/ui/LoadingSpinner';
import { PageHeader } from '../_components/ui/PageHeader';
import { Project } from '../_constants/Projects';
import RequestManager from '../_helpers/RequestManager';
import Recipe from '../_models/Recipe';

export default function Recipes() {
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => {
        setIsOpen(false);
    }

    const { data: recipes, error, isLoading, mutate } = useSWR<Recipe[]>('/recipes', () => RequestManager.get<Recipe[]>('/recipes'));
    if (isLoading) {
        return <LoadingSpinner message="Loading recipes..." />;
    }
    if (error || recipes === undefined) {
        return <ErrorMessage errorMessage={error.message} />;
    }

    // Possible header color: headerColor="#FFDF8E"
    return (<>
        <PageHeader title="All Recipes" rightContainer={<LinkButton url={`/projects/${Project.Recipes}`} label="Project Details" />} />
        <Box className="px-2">
            <Grid container spacing={1}>
                <Grid size={{ sm: 4, xs: 12 }}>
                    <AddModelCard
                        onClick={() => setIsOpen(true)}
                        title={'Add Recipe'}
                    />
                </Grid>
                {recipes.map(r => (
                    <Grid size={{ sm: 4, xs: 12 }} key={r.recipeId}>
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