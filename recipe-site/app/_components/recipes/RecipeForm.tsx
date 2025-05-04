'use client'

import { Box, Button, DialogContent, Grid, IconButton, Modal, Paper, TextField, Typography } from "@mui/material"
import { useState } from "react";
import { Add, Edit } from "@mui/icons-material";
import Recipe from "@/app/_models/Recipe";
import RequestManager from "@/app/_helpers/RequestManager";
import { useForm } from "react-hook-form";

interface RecipeFormProps {
    recipeData: Recipe | undefined;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ recipeData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => {
        setIsOpen(false);
    }

    const isEdit = recipeData !== undefined;
    const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: recipeData ?? {} });
    const onSubmit = (data: Recipe) => {
        console.log(data);
        if (isEdit) {
            RequestManager.post("/updateRecipe", data);
        } else {
            RequestManager.post("/createRecipe", data);
        }

        onClose();
    }

    return <>
        {isEdit && <IconButton className="float-right" aria-label="edit" onClick={() => setIsOpen(!isOpen)}><Edit /></IconButton>}
        {!isEdit && <Button variant='text' onClick={() => setIsOpen(!isOpen)} startIcon={<Add />}>Add Recipe</Button>}
        <Modal open={isOpen} onClose={onClose}>
            <DialogContent>
                <Paper elevation={3} className="m-2 p-2">
                    <Box className="m-2 p-2">
                        <Typography variant="h4" className="mb-4" textAlign="center">{isEdit ? "Edit Recipe" : "Add Recipe"}</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2} className="mb-2">
                                <Grid size={12}>
                                    {/* <TextInput /> */}
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
                        {/* <Typography variant="h4">{recipeData.name}</Typography>
        <Typography variant="body1">Prep Time: {recipeData.prepTimeMinutes}</Typography>
        <Typography variant="body1">Cook Time: {recipeData.cookTimeMinutes}</Typography>
        <Typography variant="body1">Instructions: {recipeData.instructions}</Typography> */}
                    </Box>
                </Paper>
            </DialogContent>
        </Modal>
    </>
}