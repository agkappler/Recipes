import Recipe from "@/app/models/Recipe"
import { Box, Button, Paper, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import { TextInput } from "../inputs/TextInput"

interface RecipeFormProps {
    recipeData: Recipe,
    onClose: () => void
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ recipeData, onClose }) => {
    const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues: recipeData });

    return <Paper elevation={3} className="m-2 p-2">
        <form onSubmit={handleSubmit((data) => console.log(data))}>
            <TextInput />
            <Box className="flex justify-between py-2">
                <Button type="button" variant="outlined" color="secondary" onClick={onClose}>Close</Button>
                <Button type="submit" variant="contained" color="primary">Submit</Button>
            </Box>
        </form>
        {/* <Typography variant="h4">{recipeData.name}</Typography>
        <Typography variant="body1">Prep Time: {recipeData.prepTimeMinutes}</Typography>
        <Typography variant="body1">Cook Time: {recipeData.cookTimeMinutes}</Typography>
        <Typography variant="body1">Instructions: {recipeData.instructions}</Typography> */}
    </Paper>
}