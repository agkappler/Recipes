import { BaseInputProps } from "@/app/_helpers/BaseInputProps";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { useFormContext } from "react-hook-form";

interface SwitchInputProps extends BaseInputProps { }

export const SwitchInput: React.FC<SwitchInputProps> = ({ label, fieldName, requiredMessage, onChange }) => {
    const { register, formState: { defaultValues } } = useFormContext();
    return <FormGroup>
        <FormControlLabel
            label={label}
            control={
                <Switch
                    {...register(fieldName, { required: requiredMessage })}
                    defaultChecked={defaultValues?.[fieldName] ?? false}
                />
            }
        />
    </FormGroup>
}