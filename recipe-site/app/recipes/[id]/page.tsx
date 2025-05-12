import { IngredientList } from "@/app/_components/recipes/IngredientList";
import { RecipeForm } from "@/app/_components/recipes/RecipeForm";
import { ErrorMessage } from "@/app/_components/ui/ErrorMessage";
import { LinkButton } from "@/app/_components/ui/LinkButton";
import { PageHeader } from "@/app/_components/ui/PageHeader";
import RequestManager from "@/app/_helpers/RequestManager";
import SlugProps from "@/app/_helpers/SlugProps";
import Ingredient from "@/app/_models/Ingredient";
import RecipeModel from "@/app/_models/Recipe";
import { Box, Typography } from "@mui/material";
import Error from "next/error";

export default async function Recipe({ params }: SlugProps) {
    let recipeData: RecipeModel;
    let ingredients: Ingredient[];
    try {
        recipeData = (await RequestManager.get(`/recipe/${params.id}`)) as RecipeModel;
        ingredients = (await RequestManager.get(`/ingredientsForRecipe/${params.id}`)) as Ingredient[];
    } catch (error: Error | any) {
        return <ErrorMessage errorMessage={error.message} />;
    }

    return <>
        <PageHeader
            title={recipeData.name}
            leftContainer={<LinkButton label="All Recipes" url="/recipes" isForward={false} />}
            rightContainer={<RecipeForm recipeData={recipeData} />}
        />
        <Box className="m-2 p-2">
            <Typography variant="body1">Prep Time: {recipeData.prepTimeMinutes}</Typography>
            <Typography variant="body1">Cook Time: {recipeData.cookTimeMinutes}</Typography>
            <Typography variant="body1">Instructions: {recipeData.instructions}</Typography>
            <IngredientList ingredients={ingredients} recipeId={recipeData.recipeId} />
        </Box>
    </>;
}