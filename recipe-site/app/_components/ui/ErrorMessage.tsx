import { Alert } from "@mui/material";

interface ErrorMessageProps {
    errorMessage: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ errorMessage }) => {
    return <Alert severity="error" variant="outlined">
        {errorMessage}
    </Alert>
}