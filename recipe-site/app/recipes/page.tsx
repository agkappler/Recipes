import { Box, Grid } from '@mui/material';
import { RecipeCard } from '../_components/recipes/RecipeCard';
import { RecipeForm } from '../_components/recipes/RecipeForm';
import { ErrorMessage } from '../_components/ui/ErrorMessage';
import { PageHeader } from '../_components/ui/PageHeader';
import RequestManager from '../_helpers/RequestManager';
import Recipe from '../_models/Recipe';
// import useSWR from 'swr';

export default async function Recipes() {
    let recipeData: Recipe[];
    try {
        recipeData = await RequestManager.get('/recipes');
    } catch (error: Error | any) {
        return <ErrorMessage errorMessage={error.message} />;
    }

    return (
        <Box className="mx-2">
            <PageHeader title="All Recipes" rightContainer={<RecipeForm recipeData={undefined} />} />
            <Grid container spacing={1}>
                {recipeData.map(r => (
                    <Grid size={6} key={r.recipeId}>
                        <RecipeCard recipeData={r} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}