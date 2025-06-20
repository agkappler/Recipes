'use client';

import RequestManager from "@/app/_helpers/RequestManager";
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { successToast } from "../_helpers/Toasts";
import { ErrorMessage } from "./ui/ErrorMessage";
import { getErrorMessage } from "../_helpers/Errors";

interface LoginFormInputs {
    username: string;
    password: string;
}

export const LoginForm: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        console.log("Login Data:", data);
        try {
            const authResponse = await RequestManager.authenticateUser(data.username, data.password);
            console.log("Auth Response:", authResponse);
            setErrorMessage(undefined);
            successToast('Succesfully logged in!');
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error));
        }

        // Handle login logic here
    };

    const logout = async () => {
        try {
            await RequestManager.logout();
            setErrorMessage(undefined);
            successToast('Succesfully logged out!');
        }
        catch (error: unknown) {
            setErrorMessage(getErrorMessage(error));
        }
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 3, border: "1px solid #ccc", borderRadius: 2 }}
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
            <Button onClick={logout}>Logout</Button>
        </Box>
    );
};