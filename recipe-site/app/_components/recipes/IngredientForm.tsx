import { getErrorMessage } from "@/app/_helpers/Errors";
import RequestManager from "@/app/_helpers/RequestManager";
import Ingredient from "@/app/_models/Ingredient";
import { Grid } from "@mui/material";
import { useState } from "react";
import { BasicForm } from "../inputs/BasicForm";
import { NumberInput } from "../inputs/NumberInput";
import { TextInput } from "../inputs/TextInput";
import { SimpleDialog } from "../ui/SimpleDialog";

interface IngredientFormProps {
    isOpen: boolean;
    onClose: () => void;
    ingredient?: Ingredient;
    recipeId: number;
    updateIngredients: () => void;
}

export const IngredientForm: React.FC<IngredientFormProps> = ({ isOpen, onClose, ingredient, recipeId, updateIngredients }) => {
    const isEdit = ingredient !== undefined;
    const [errorMessage, setErrorMessage] = useState<string>();

    const onSubmit = async (data: Ingredient) => {
        try {
            if (isEdit) {
                await RequestManager.post("/updateIngredient", data);
            } else {
                await RequestManager.post(`/addIngredientToRecipe/${recipeId}`, data);
            }
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error));
            return;
        }

        updateIngredients();
        onClose();
    }

    return <SimpleDialog title={isEdit ? "Edit Ingredient" : "Add Ingredient"} isOpen={isOpen} onClose={onClose}>
        <BasicForm
            errorMessage={errorMessage}
            onSubmit={onSubmit}
            closeForm={onClose}
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
                    <TextInput
                        label="Quantity"
                        fieldName="quantity"
                        requiredMessage="Quantity is required"
                    />
                </Grid>
                <Grid size={6}>
                    <NumberInput
                        label="Calories"
                        fieldName="calories"
                        requiredMessage="Calories are required"
                    />
                </Grid>
            </Grid>
        </BasicForm>
    </SimpleDialog>
}