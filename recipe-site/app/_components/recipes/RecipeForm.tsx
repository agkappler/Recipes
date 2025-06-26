'use client'

import { FileRole } from "@/app/_constants/FileRole";
import { getErrorMessage } from "@/app/_helpers/Errors";
import RequestManager from "@/app/_helpers/RequestManager";
import FileMetadata from "@/app/_models/FileMetadata";
import Recipe from "@/app/_models/Recipe";
import { Grid } from "@mui/material";
import { useState } from "react";
import { BasicForm } from "../inputs/BasicForm";
import { FileUpload } from "../inputs/FileUpload";
import { NumberInput } from "../inputs/NumberInput";
import { TextInput } from "../inputs/TextInput";
import { SimpleDialog } from "../ui/SimpleDialog";

interface RecipeFormProps {
    isOpen: boolean;
    onClose: () => void;
    recipeData: Recipe | undefined;
    updateRecipe: () => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ isOpen, onClose, recipeData, updateRecipe }) => {
    const isEdit = recipeData !== undefined;
    const [errorMessage, setErrorMessage] = useState<string>();
    const onSubmit = async (data: Recipe) => {
        try {
            if (isEdit) {
                await RequestManager.post("/updateRecipe", data);
            } else {
                await RequestManager.post("/createRecipe", data);
            }
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error));
            return;
        }

        updateRecipe();
        onClose();
    }

    const onUpload = async (fileMetadata: FileMetadata) => {
        await RequestManager.post(`/updateRecipeAvatar?recipeId=${recipeData?.recipeId}&fileId=${fileMetadata.fileId}`, {});
        updateRecipe();
    }

    return <SimpleDialog title={isEdit ? "Edit Recipe" : "Add Recipe"} isOpen={isOpen} onClose={onClose}>
        <BasicForm
            onSubmit={onSubmit}
            defaultValues={recipeData}
            closeForm={onClose}
            errorMessage={errorMessage}
        >
            <Grid container spacing={2} className="mb-2">
                {isEdit && <Grid size={12}>
                    <FileUpload
                        label="Upload Image"
                        fileRole={FileRole.RecipeImage}
                        onUpload={onUpload}
                        isAvatar={true}
                        currentAvatarId={recipeData.avatarId}
                    />
                </Grid>}
                <Grid size={12}>
                    <TextInput
                        label="Name"
                        fieldName="name"
                        requiredMessage="Name is required"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        label="Prep Time (minutes)"
                        fieldName="prepTimeMinutes"
                        requiredMessage="Prep Time is required"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <NumberInput
                        label="Cook Time (minutes)"
                        fieldName="cookTimeMinutes"
                        requiredMessage="Cook Time is required"
                    />
                </Grid>
                <Grid size={6}>
                    <NumberInput
                        label="Total Calories"
                        fieldName="totalCalories"
                    />
                </Grid>
                <Grid size={6}>
                    <TextInput
                        label="Quantity Info"
                        fieldName="quantity"
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
    </SimpleDialog>
}