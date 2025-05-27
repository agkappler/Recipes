import RequestManager from "@/app/_helpers/RequestManager";
import { DndItem, getSubclasses, getSubraces } from "@/app/api/dnd5eapi";
import { DialogContent, Grid, Modal } from "@mui/material";
import React, { useState } from "react";
import useSWR from "swr";
import Character from "../../_models/Character";
import { BasicForm } from "../inputs/BasicForm";
import { ComboBoxInput } from "../inputs/ComboBoxInput";
import { DropdownInput } from "../inputs/DropdownInput";
import { NumberInput } from "../inputs/NumberInput";
import { TextInput } from "../inputs/TextInput";

interface CharacterFormProps {
    isOpen: boolean;
    onClose: () => void;
    character?: Character;
    updateCharacters: () => void;
    classes: DndItem[];
    races: DndItem[];
}

export const CharacterForm: React.FC<CharacterFormProps> = ({
    isOpen,
    onClose,
    character,
    updateCharacters,
    classes,
    races
}) => {
    const isEdit = character !== undefined;
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const closeForm = () => {
        setErrorMessage(undefined);
        onClose();
    }

    const raceOptions = races.map(race => ({ value: race.index, label: race.name })),
        classOptions = classes.map(classOption => ({ value: classOption.index, label: classOption.name }));
    const { data: monkData } = useSWR("/monk", () => getSubclasses("monk"));
    const subclassOptions = (monkData?.results ?? []).map(o => ({ value: o.index, label: o.name }));
    const { data: dwarfData } = useSWR("/dwarf", () => getSubraces("dwarf"));
    const subraceOptions = (dwarfData?.results ?? []).map(o => ({ value: o.index, label: o.name }));


    const onSubmit = async (data: Character) => {
        try {
            setIsLoading(true);
            if (isEdit) {
                await RequestManager.post("/updateCharacter", data);
            } else {
                await RequestManager.post('/createCharacter', data);
            }
        } catch (error: ErrorEvent | any) {
            setErrorMessage(error.message);
            return;
        } finally {
            setIsLoading(false);
        }

        updateCharacters();
        closeForm();
    }

    return (<Modal open={isOpen} onClose={closeForm}>
        <DialogContent>
            <BasicForm
                title={isEdit ? "Update Character" : "Create Character"}
                onSubmit={onSubmit}
                isSubmitting={isLoading}
                defaultValues={character}
                closeForm={onClose}
                errorMessage={errorMessage}
            >
                <Grid container spacing={2} className="mb-2">
                    <Grid size={6}>
                        <TextInput
                            label="Name"
                            fieldName="name"
                            requiredMessage="Name is required"
                        />
                    </Grid>
                    <Grid size={6}>
                        <NumberInput
                            label="Level"
                            fieldName="level"
                            requiredMessage="Level is required"
                        />
                    </Grid>
                    <Grid size={6}>
                        <ComboBoxInput
                            label="Race"
                            fieldName="race"
                            options={raceOptions}
                            requiredMessage="Race is required"
                        />
                    </Grid>
                    <Grid size={6}>
                        <DropdownInput
                            label="Class"
                            fieldName="className"
                            options={classOptions}
                            requiredMessage="Class is required"
                        />
                    </Grid>
                    <Grid size={6}>
                        <DropdownInput
                            label="Subrace"
                            fieldName="subrace"
                            options={subraceOptions}
                            requiredMessage="Subrace is required"
                        />
                    </Grid>
                    <Grid size={6}>
                        <DropdownInput
                            label="Subclass"
                            fieldName="subclassName"
                            options={subclassOptions}
                        />
                    </Grid>
                </Grid>
            </BasicForm>
        </DialogContent>
    </Modal>)
}