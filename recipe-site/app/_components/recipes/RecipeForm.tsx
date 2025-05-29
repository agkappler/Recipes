'use client'

import RequestManager from "@/app/_helpers/RequestManager";
import Recipe from "@/app/_models/Recipe";
import { DialogContent, Grid, Modal } from "@mui/material";
import { useState } from "react";
import { BasicForm } from "../inputs/BasicForm";
import { NumberInput } from "../inputs/NumberInput";
import { TextInput } from "../inputs/TextInput";

interface RecipeFormProps {
    isOpen: boolean;
    onClose: () => void;
    recipeData: Recipe | undefined;
    updateRecipe: () => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ isOpen, onClose, recipeData, updateRecipe }) => {
    const isEdit = recipeData !== undefined;
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const onSubmit = async (data: Recipe) => {
        try {
            setIsLoading(true);
            if (isEdit) {
                await RequestManager.post("/updateRecipe", data);
            } else {
                await RequestManager.post("/createRecipe", data);
            }
        } catch (error: any) {
            setErrorMessage(error.message);
            return;
        } finally {
            setIsLoading(false);
        }

        if (updateRecipe) updateRecipe();
        onClose();
    }

    return <Modal open={isOpen} onClose={onClose}>
        <DialogContent>
            <BasicForm
                title={isEdit ? "Edit Recipe" : "Add Recipe"}
                onSubmit={onSubmit}
                isSubmitting={isLoading}
                defaultValues={recipeData}
                closeForm={onClose}
                errorMessage={errorMessage}
            >
                <Grid container spacing={2} className="mb-2">
                    <Grid size={12}>
                        <TextInput
                            label="Name"
                            fieldName="name"
                            requiredMessage="Name is required"
                        />
                    </Grid>
                    <Grid size={6}>
                        <NumberInput
                            label="Prep Time (minutes)"
                            fieldName="prepTimeMinutes"
                            requiredMessage="Prep Time is required"
                        />
                    </Grid>
                    <Grid size={6}>
                        <NumberInput
                            label="Cook Time (minutes)"
                            fieldName="cookTimeMinutes"
                            requiredMessage="Cook Time is required"
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextInput
                            label="Instructions"
                            fieldName="instructions"
                            requiredMessage="Instructions are required"
                            multilineRows={4}
                        />
                    </Grid>
                </Grid>
            </BasicForm>
        </DialogContent>
    </Modal>
}