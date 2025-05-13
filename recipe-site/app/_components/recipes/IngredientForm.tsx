import RequestManager from "@/app/_helpers/RequestManager";
import Ingredient from "@/app/_models/Ingredient";
import { Box, Button, DialogContent, Grid, Modal, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "../ui/ErrorMessage";

interface IngredientFormProps {
    isOpen: boolean;
    onClose: () => void;
    ingredient?: Ingredient;
    recipeId: number;
    updateIngredients: () => void;
}

export const IngredientForm: React.FC<IngredientFormProps> = ({ isOpen, onClose, ingredient, recipeId, updateIngredients }) => {
    const isEdit = ingredient !== undefined;
    const { control, handleSubmit, formState: { errors } } = useForm<Ingredient>({ defaultValues: ingredient ?? {} });
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: Ingredient) => {
        try {
            setIsLoading(true);
            if (isEdit) {
                await RequestManager.post("/updateIngredient", data);
            } else {
                await RequestManager.post(`/addIngredientToRecipe/${recipeId}`, data);
            }
        } catch (error: ErrorEvent | any) {
            setErrorMessage(error.message);
            return;
        } finally {
            setIsLoading(false);
        }

        updateIngredients();
        onClose();
    }

    return <Modal open={isOpen} onClose={onClose}>
        <DialogContent>
            <Paper elevation={3} className="m-2 p-2">
                <Typography variant="h4" className="mb-4" textAlign="center">{isEdit ? "Edit Ingredient" : "Add Ingredient"}</Typography>
                <ErrorMessage errorMessage={errorMessage} />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2} className="mb-2">
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                {...control.register("name", { required: "Name is required" })}
                                error={!!errors.name}
                                helperText={errors.name ? errors.name.message : ""}
                            />
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                label="Quantity"
                                {...control.register("quantity", { required: "Quantity is required" })}
                                error={!!errors.quantity}
                                helperText={errors.quantity?.message ?? ""}
                            />
                        </Grid>
                        <Grid size={6}>
                            <TextField
                                fullWidth
                                label="Calories"
                                {...control.register("calories", { required: "Calories are required" })}
                                error={!!errors.calories}
                                helperText={errors.calories?.message ?? ""}
                                type="number"
                            />
                        </Grid>
                    </Grid>
                    <Box className="flex justify-between py-2">
                        <Button type="button" variant="outlined" color="secondary" onClick={onClose}>Close</Button>
                        <Button type="submit" variant="contained" color="primary" loading={isLoading}>Submit</Button>
                    </Box>
                </form>
            </Paper>
        </DialogContent>
    </Modal>
}