'use client'

import { Box, Button, DialogContent, Grid, IconButton, Modal, Paper, TextField, Typography } from "@mui/material"
import { useState } from "react";
import { Add, Edit } from "@mui/icons-material";
import Recipe from "@/app/_models/Recipe";
import RequestManager from "@/app/_helpers/RequestManager";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "../ui/ErrorMessage";

interface RecipeFormProps {
    recipeData: Recipe | undefined;
    updateRecipe: () => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ recipeData, updateRecipe }) => {
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => {
        setIsOpen(false);
    }

    const isEdit = recipeData !== undefined;
    const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: recipeData ?? {} });

    const [errorMessage, setErrorMessage] = useState<string>();
    const onSubmit = async (data: Recipe) => {
        try {
            if (isEdit) {
                await RequestManager.post("/updateRecipe", data);
            } else {
                await RequestManager.post("/createRecipe", data);
            }
        } catch (error: any) {
            setErrorMessage(error.message);
            return;
        }

        if (updateRecipe) updateRecipe();
        onClose();
    }

    return <>
        {isEdit && <IconButton className="float-right" size="medium" aria-label="edit" onClick={() => setIsOpen(!isOpen)}><Edit /></IconButton>}
        {!isEdit && <Button variant='text' onClick={() => setIsOpen(!isOpen)} startIcon={<Add />}>Add Recipe</Button>}
        <Modal open={isOpen} onClose={onClose}>
            <DialogContent>
                <Paper elevation={3} className="m-2 p-2">
                    <Typography variant="h4" className="mb-4" textAlign="center">{isEdit ? "Edit Recipe" : "Add Recipe"}</Typography>
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
                                    label="Prep Time (minutes)"
                                    {...control.register("prepTimeMinutes", { required: "Prep Time is required" })}
                                    error={!!errors.prepTimeMinutes}
                                    helperText={errors.prepTimeMinutes ? errors.prepTimeMinutes.message : ""}
                                    type="number"
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    fullWidth
                                    label="Cook Time (minutes)"
                                    {...control.register("cookTimeMinutes", { required: "Cook Time is required" })}
                                    error={!!errors.cookTimeMinutes}
                                    helperText={errors.cookTimeMinutes ? errors.cookTimeMinutes.message : ""}
                                    type="number"
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    label="Instructions"
                                    {...control.register("instructions", { required: "Insructions are required" })}
                                    error={!!errors.instructions}
                                    helperText={errors.instructions ? errors.instructions.message : ""}
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                        </Grid>
                        <Box className="flex justify-between py-2">
                            <Button type="button" variant="outlined" color="secondary" onClick={onClose}>Close</Button>
                            <Button type="submit" variant="contained" color="primary">Submit</Button>
                        </Box>
                    </form>
                </Paper>
            </DialogContent>
        </Modal>
    </>
}