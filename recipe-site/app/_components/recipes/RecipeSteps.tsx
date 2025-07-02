import RequestManager from "@/app/_helpers/RequestManager";
import RecipeStep from "@/app/_models/RecipeStep";
import useSWR from "swr";
import { RecipeStepsForm } from "./RecipeStepsForm";
import { useState } from "react";
import { LoadingWrapper } from "../ui/LoadingWrapper";
import { Box, Button, Typography } from "@mui/material";

interface RecipeStepsProps {
    recipeId: number;
}

export const RecipeSteps: React.FC<RecipeStepsProps> = ({ recipeId }) => {
    const [isStepsOpen, setIsStepsOpen] = useState(false);
    const onCloseSteps = () => {
        setIsStepsOpen(false);
    }
    const { data: recipeSteps, isLoading, mutate: updateSteps } = useSWR<RecipeStep[]>(
        `/stepsForRecipe/${recipeId}`,
        () => RequestManager.get<RecipeStep[]>(`/stepsForRecipe/${recipeId}`)
    );

    return <>
        <Typography variant="h6" textAlign="center">Instructions</Typography>
        <LoadingWrapper isLoading={isLoading}>
            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                {(!recipeSteps || recipeSteps.length === 0) && (
                    <Typography variant="body1">No steps yet!</Typography>
                )}
                {recipeSteps?.map((step) => (
                    <Typography key={step.stepNumber} variant="body1">{step.stepNumber}. {step.description}</Typography>
                ))}
                <Button onClick={() => setIsStepsOpen(true)} className="justify-self-center">Manage Steps</Button>
            </Box>
            <RecipeStepsForm
                isOpen={isStepsOpen}
                onClose={onCloseSteps}
                recipeSteps={recipeSteps}
                updateSteps={updateSteps}
                recipeId={recipeId}
            />
        </LoadingWrapper>
    </>
}