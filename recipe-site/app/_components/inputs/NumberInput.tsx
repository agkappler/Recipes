import { BaseInputProps } from "@/app/_helpers/BaseInputProps"
import { TextField } from "@mui/material"
import { useFormContext } from "react-hook-form";

export const NumberInput: React.FC<BaseInputProps> = ({ label, fieldName, requiredMessage }) => {
    const { register, formState: { errors } } = useFormContext();
    return <TextField
        fullWidth
        label={label}
        {...register(fieldName, { required: requiredMessage })}
        error={!!errors[fieldName]}
        helperText={errors[fieldName]?.message as string ?? ""}
        type="number"
    />
}