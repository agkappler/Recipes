// 'use client'


import Link from 'next/link';

type Recipe = {
    id: number;
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    instructions: string;
}

export default async function Recipes() {
    const recipeData = await (await fetch('http://localhost:8080/recipes')).json();
        // .then(response => response.blob())
        // .then(data => recipeData = data.text().toString());
    debugger;
    console.log(recipeData);
    console.log(JSON.stringify({ 1: 'Cook.'}));
    const recipes = recipeData.map((recipe: Recipe) => {
        console.log(recipe.instructions);
        return {
            ...recipe,
            instructionList: JSON.parse('{"1":"Cook."}')
        };
    });
    console.log(recipeData);
    // const resolvedRecipes = await Promise.all(recipes);
    
    return (
        <div>
            <h1>{`${recipeData}`}</h1>
            <ul>
                {recipes.map((r, i) => (
                    <li key={i}>
                        <h1><Link href={`/recipes/${r.id}`}>{r.name}</Link></h1>
                        <div>
                            <p>Prep Time: {r.prepTimeMinutes}</p>
                            <p>Cook Time: {r.cookTimeMinutes}</p>
                            <h2>Instructions</h2>
                            <p>{recipeData.instructions}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}