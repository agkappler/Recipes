import { Box, Button, Paper, Typography } from "@mui/material"
import { ErrorMessage } from "../ui/ErrorMessage"
import { DefaultValues, FieldValues, FormProvider, useForm } from "react-hook-form"
import { PropsWithChildren } from "react";

interface BasicFormProps<T> extends PropsWithChildren {
    title: string;
    errorMessage?: string;
    onSubmit: (data: T) => Promise<void>;
    isSubmitting: boolean;
    defaultValues?: T;
    closeForm: () => void;
}

export const BasicForm = <T extends FieldValues,>({ children, defaultValues, title, errorMessage, onSubmit, isSubmitting, closeForm }: BasicFormProps<T>) => {
    const methods = useForm<T>({ defaultValues: defaultValues as DefaultValues<T> });

    return (<Paper elevation={3} className="m-2 p-2">
        <Typography variant="h4" marginBottom={4} textAlign="center">{title}</Typography>
        <ErrorMessage errorMessage={errorMessage} />
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                {children}
                <Box className="flex justify-between py-2">
                    <Button type="button" variant="outlined" color="secondary" onClick={closeForm}>Close</Button>
                    <Button type="submit" variant="contained" color="primary" loading={isSubmitting}>Submit</Button>
                </Box>
            </form>
        </FormProvider>
    </Paper>);
}