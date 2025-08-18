import { getErrorMessage } from "@/app/_helpers/Errors";
import RequestManager from "@/app/_helpers/RequestManager";
import Weapon from "@/app/_models/Weapon";
import { Grid } from "@mui/material";
import React, { useState } from "react";
import { BasicForm } from "../../inputs/BasicForm";
import { TextInput } from "../../inputs/TextInput";
import { SimpleDialog } from "../../ui/SimpleDialog";

interface WeaponFormProps {
    isOpen: boolean;
    onClose: () => void;
    characterId: number;
    weapon?: Weapon;
    updateWeapons: () => void;
}

export const WeaponForm: React.FC<WeaponFormProps> = ({
    isOpen,
    onClose,
    characterId,
    weapon,
    updateWeapons
}) => {
    const isEdit = weapon !== undefined;
    const [errorMessage, setErrorMessage] = useState<string>();

    const closeForm = () => {
        setErrorMessage(undefined);
        onClose();
    }

    const onSubmit = async (data: Weapon) => {
        try {
            const weaponData = {
                ...data,
                characterId: characterId
            };

            if (isEdit) {
                await RequestManager.put(`/updateWeapon/${weapon.weaponId}`, weaponData);
            } else {
                await RequestManager.post(`/addWeapon`, weaponData);
            }
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error));
            return;
        }

        updateWeapons();
        closeForm();
    }

    return (
        <SimpleDialog title={isEdit ? "Update Weapon" : "Add Weapon"} isOpen={isOpen} onClose={closeForm}>
            <BasicForm
                onSubmit={onSubmit}
                defaultValues={weapon}
                closeForm={closeForm}
                errorMessage={errorMessage}
            >
                <Grid container spacing={2} className="mb-2">
                    <Grid size={12}>
                        <TextInput
                            label="Weapon Name"
                            fieldName="name"
                            requiredMessage="Weapon name is required"
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextInput
                            label="Damage"
                            fieldName="damage"
                            requiredMessage="Damage is required"
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextInput
                            label="Description"
                            fieldName="description"
                            multilineRows={3}
                        />
                    </Grid>
                </Grid>
            </BasicForm>
        </SimpleDialog>
    );
};
