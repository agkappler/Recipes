'use client';

import RequestManager from "@/app/_helpers/RequestManager";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { getErrorMessage } from "../_helpers/Errors";
import { successToast } from "../_helpers/Toasts";
import { useAppContext } from "./AppContext";
import { BasicForm } from "./inputs/BasicForm";
import { TextInput } from "./inputs/TextInput";
import { ErrorMessage } from "./ui/ErrorMessage";
import { SimpleDialog } from "./ui/SimpleDialog";

interface LoginFormInputs {
    username: string;
    password: string;
}

export const LoginForm: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const { setUser, isAuthenticated } = useAppContext();
    const [userErrorMessage, setUserErrorMessage] = useState<string | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => setIsOpen(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        try {
            const response = await RequestManager.authenticateUser(data.username, data.password);
            setErrorMessage(undefined);
            successToast('Succesfully logged in!');
            setUser(response.user);
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error));
        }
    };

    const logout = async () => {
        try {
            await RequestManager.logout();
            setErrorMessage(undefined);
            successToast('Succesfully logged out!');
            setUser(undefined);
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error));
        }
    }

    const createUser = async (data: { username: string, password: string }) => {
        setIsSubmitting(true);
        try {
            await RequestManager.post("/users/createUser", data);
            setUserErrorMessage(undefined);
            successToast('Succesfully created user!');
        } catch (error: unknown) {
            setUserErrorMessage(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (<>
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 3, border: "1px solid #ccc", borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
            <Typography variant="h5" textAlign="center" mb={3}>
                Login
            </Typography>
            <TextField
                fullWidth
                label="Username"
                {...register("username", { required: "Username is required" })}
                error={!!errors.username}
                helperText={errors.username?.message}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                {...register("password", { required: "Password is required" })}
                error={!!errors.password}
                helperText={errors.password?.message}
                margin="normal"
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
            >
                Login
            </Button>
            <ErrorMessage errorMessage={errorMessage} />
            {isAuthenticated && <Box display="flex" justifyContent="space-between" marginTop={2}>
                <Button onClick={logout}>Logout</Button>
                <Button onClick={() => setIsOpen(true)}>Create User</Button>
            </Box>}

        </Box>
        <SimpleDialog title="Create User" isOpen={isOpen} onClose={onClose}>
            <BasicForm
                errorMessage={userErrorMessage}
                onSubmit={createUser}
                isSubmitting={isSubmitting}
                closeForm={onClose}
            >
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <TextInput
                            label="Email"
                            fieldName="email"
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextInput
                            label="Password"
                            fieldName="password"
                        />
                    </Grid>
                </Grid>
            </BasicForm>
        </SimpleDialog>
    </>);
};