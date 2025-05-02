import { RecipeCard } from "@/app/components/recipes/RecipeCard";
import { ChevronLeft } from "@mui/icons-material";
import { Button } from "@mui/material";

interface RecipeProps {
    params: {
        id: string;
    };
}

export default async function Recipe({ params }: RecipeProps) {
    const response = await fetch(`http://localhost:8080/recipe/${params.id}`);
    const recipeData = await response.json();
    return <>
        <Button variant="text" startIcon={<ChevronLeft />} href="/recipes">
            Back
        </Button>
        <RecipeCard recipeData={recipeData} />
    </>;
}