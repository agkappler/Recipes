import { TextField } from "@mui/material"
import { useFormContext } from "react-hook-form";

interface TextInputProps {
    label: string;
    fieldName: string;
    requiredMessage?: string;
    multilineRows?: number;
}

export const TextInput: React.FC<TextInputProps> = ({ label, fieldName, requiredMessage, multilineRows }) => {
    const { register, formState: { errors } } = useFormContext();
    return <TextField
        fullWidth
        label={label}
        {...register(fieldName, { required: requiredMessage })}
        error={!!errors[fieldName]}
        helperText={errors[fieldName] ? errors[fieldName].message as string : ""}
        multiline={multilineRows !== undefined}
        rows={multilineRows}
    />
}