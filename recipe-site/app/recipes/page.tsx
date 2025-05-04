import { RecipeCard } from '../_components/recipes/RecipeCard';
import { RecipeForm } from '../_components/recipes/RecipeForm';
import Recipe from '../_models/Recipe';
// import useSWR from 'swr';

export default async function Recipes() {
    const recipeData: Recipe[] = await fetch('http://localhost:8080/api/recipes')
        .then(response => response.json());

    return (
        <div>
            <RecipeForm recipeData={undefined} />
            {recipeData.map(r => (
                <RecipeCard key={r.recipeId} recipeData={r} />
            ))}
        </div>
    );
}