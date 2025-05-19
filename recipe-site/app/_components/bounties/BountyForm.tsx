import RequestManager from "@/app/_helpers/RequestManager";
import Bounty from "@/app/_models/Bounty";
import { Box, Button, DialogContent, Grid, Modal, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "../ui/ErrorMessage";

interface BountyFormProps {
    isOpen: boolean;
    onClose: () => void;
    bounty?: Bounty;
    categoryId?: number;
    updateBounties: () => void;
}

export const BountyForm: React.FC<BountyFormProps> = ({ isOpen, onClose, bounty, categoryId, updateBounties }) => {
    const isEdit = bounty !== undefined;
    const { control, handleSubmit, formState: { errors } } = useForm<Bounty>({ defaultValues: bounty ?? {} });
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: Bounty) => {
        try {
            setIsLoading(true);
            if (isEdit) {
                // await RequestManager.post("/updateIngredient", data);
            } else {
                data.status = "IN_PROGRESS";
                data.cadence = "ONE_TIME";
                await RequestManager.post(`/createBounty`, data);
            }
        } catch (error: ErrorEvent | any) {
            setErrorMessage(error.message);
            return;
        } finally {
            setIsLoading(false);
        }

        updateBounties();
        onClose();
    }

    return <Modal open={isOpen} onClose={onClose}>
        <DialogContent>
            <Paper elevation={3} className="m-2 p-2">
                <Typography variant="h4" className="mb-4" textAlign="center">{isEdit ? "Update Bounty" : "Post Bounty"}</Typography>
                <ErrorMessage errorMessage={errorMessage} />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2} className="mb-2">
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                {...control.register("title", { required: "Title is required" })}
                                error={!!errors.title}
                                helperText={errors.title ? errors.title.message : ""}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                {...control.register("description")}
                                error={!!errors.description}
                                helperText={errors.description ? errors.description.message : ""}
                                multiline
                                rows={4}
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