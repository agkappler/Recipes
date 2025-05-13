import { Alert } from "@mui/material";

interface ErrorMessageProps {
    errorMessage: string | undefined;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ errorMessage }) => {
    return <>{errorMessage !== undefined && <Alert severity="error" variant="outlined">
        {errorMessage}
    </Alert>}
    </>
}