import RequestManager from "@/app/_helpers/RequestManager";
import { DndItem, getClasses, getRaces, getSubclasses, getSubraces } from "@/app/api/dnd5eapi";
import { DialogContent, Grid, Modal } from "@mui/material";
import React, { useState } from "react";
import useSWR from "swr";
import Character from "../../_models/Character";
import { BasicForm } from "../inputs/BasicForm";
import { ComboBoxInput } from "../inputs/ComboBoxInput";
import { DropdownInput } from "../inputs/DropdownInput";
import { NumberInput } from "../inputs/NumberInput";
import { TextInput } from "../inputs/TextInput";
import { FileUploadButton } from "../inputs/FileUploadButton";
import { FileRole } from "@/app/_constants/FileRole";
import FileMetadata from "@/app/_models/FileMetadata";

interface CharacterFormProps {
    isOpen: boolean;
    onClose: () => void;
    character?: Character;
    updateCharacters: () => void;
}

export const CharacterForm: React.FC<CharacterFormProps> = ({
    isOpen,
    onClose,
    character,
    updateCharacters
}) => {
    const isEdit = character !== undefined;
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const closeForm = () => {
        setErrorMessage(undefined);
        onClose();
    }

    const { data: classes, isLoading: isLoadingClasses } = useSWR<{ results: DndItem[] }>("/classes", () => getClasses());
    const { data: races, isLoading: isLoadingRaces } = useSWR<{ results: DndItem[] }>("/races", () => getRaces());

    // W/homebrew stuff.
    // const { data: classes } = useSWR<{ results: any[] }>("/classes5e", () => getOpen5eClasses());
    // const { data: races } = useSWR<{ results: any[] }>("/races5e", () => getOpen5eRaces());
    // const racesOpen5e = races?.map(r => ({ value: r.slug, label: r.name })) ?? [],
    //     classesOpen5e = classes?.map(c => ({ value: c.slug, label: c.name })) ?? [];
    // const subracesOpen5e = races.find(r => r.slug === "dwarf")?.subraces?.map((s: any) => ({ value: s.slug, label: s.name })) ?? [],
    //     subclassesOpen5e = classes.find(r => r.slug === "monk")?.archetypes?.map((a: any) => ({ value: a.slug, label: a.name })) ?? [];


    const raceOptions = (races?.results ?? []).map(race => ({ value: race.index, label: race.name })),
        classOptions = (classes?.results ?? []).map(classOption => ({ value: classOption.index, label: classOption.name }));
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

    const onUpload = async (fileMetadata: FileMetadata) => {
        await RequestManager.post("/updateAvatar", { characterId: character?.characterId, fileId: fileMetadata.fileId });
        updateCharacters();
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
                        <DropdownInput
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
                {isEdit &&
                    <FileUploadButton label="Upload Avatar" fileRole={FileRole.CharacterAvatar} onUpload={onUpload} />
                }
            </BasicForm>
        </DialogContent>
    </Modal>)
}