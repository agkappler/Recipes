import { FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface DropdownInputProps {
    label: string;
    fieldName: string;
    options: { value: string | number; label: string }[];
    requiredMessage?: string;
}

export const DropdownInput: React.FC<DropdownInputProps> = ({ label, fieldName, options, requiredMessage }) => {
    const { control } = useFormContext();
    const id = `${label}-select`;
    return (
        <FormControl fullWidth>
            <InputLabel id={`${id}-label`}>{label}</InputLabel>
            <Controller
                name={fieldName}
                control={control}
                defaultValue=""
                rules={{ required: requiredMessage }}
                render={({ field, fieldState }) => (<>
                    <Select
                        {...field}
                        labelId={`${id}-label`}
                        id={id}
                        label={label}
                        error={!!fieldState.error}
                    >
                        {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                    {fieldState.error && (
                        <FormHelperText error>{fieldState.error.message}</FormHelperText>
                    )}
                </>)}
            />
        </FormControl>
    );
}
