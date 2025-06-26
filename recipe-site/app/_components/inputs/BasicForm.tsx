import { Box, Button } from "@mui/material";
import { PropsWithChildren, useState } from "react";
import { DefaultValues, FieldValues, FormProvider, useForm } from "react-hook-form";
import { useAppContext } from "../AppContext";
import { ErrorMessage } from "../ui/ErrorMessage";

interface BasicFormProps<T> extends PropsWithChildren {
    errorMessage: string | undefined;
    onSubmit: (data: T) => Promise<void>;
    defaultValues?: T;
    closeForm: () => void;
}

export const BasicForm = <T extends FieldValues,>({ children, defaultValues, errorMessage, onSubmit, closeForm }: BasicFormProps<T>) => {
    const methods = useForm<T>({ defaultValues: defaultValues as DefaultValues<T> });
    const { isAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const awaitSubmit = async (data: T) => {
        setIsLoading(true);
        await onSubmit(data);
        setIsLoading(false);
    }

    return (<Box paddingY={1}>
        <ErrorMessage errorMessage={errorMessage} />
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(awaitSubmit)}>
                {children}
                <Box className="flex justify-between py-2">
                    <Button type="button" variant="outlined" color="secondary" onClick={closeForm}>Close</Button>
                    {isAuthenticated && <Button type="submit" variant="contained" color="primary" loading={isLoading}>Submit</Button>}
                </Box>
            </form>
        </FormProvider>
    </Box>);
}