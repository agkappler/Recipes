import { BaseInputProps } from "@/app/_helpers/BaseInputProps"
import { TextField } from "@mui/material"
import { useFormContext } from "react-hook-form";

interface NumberInputProps extends BaseInputProps { }

export const NumberInput: React.FC<NumberInputProps> = ({ label, fieldName, requiredMessage }) => {
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