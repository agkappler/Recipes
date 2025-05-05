import { RecipeCard } from '../_components/recipes/RecipeCard';
import { RecipeForm } from '../_components/recipes/RecipeForm';
import { ErrorMessage } from '../_components/ui/ErrorMessage';
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
        <div>
            <RecipeForm recipeData={undefined} />
            {recipeData.map(r => (
                <RecipeCard key={r.recipeId} recipeData={r} />
            ))}
        </div>
    );
}