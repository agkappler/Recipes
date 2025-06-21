import { getErrorMessage } from "@/app/_helpers/Errors";
import RequestManager from "@/app/_helpers/RequestManager";
import CustomDndRace from "@/app/_models/CustomDndRace";
import RacialTrait from "@/app/_models/RacialTrait";
import { DialogContent, Grid, Modal } from "@mui/material";
import { useState } from "react";
import { BasicForm } from "../../inputs/BasicForm";
import { TextInput } from "../../inputs/TextInput";

interface RaceFormProps {
    isOpen: boolean;
    onClose: () => void;
    dndRace?: CustomDndRace;
    updateDndRaces: () => void;
}

export const RaceForm: React.FC<RaceFormProps> = ({ isOpen, onClose, dndRace, updateDndRaces }) => {
    const isEdit = dndRace !== undefined;
    const defaultRace = new CustomDndRace({ raceId: 0, name: "", description: "", index: "", isCustom: true, traits: [] });
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const closeForm = () => {
        setErrorMessage(undefined);
        onClose();
    }

    const [racialTraits, setRacialTraits] = useState<RacialTrait[]>(dndRace?.traits ?? []);

    const onSubmit = async (data: CustomDndRace) => {
        try {
            setIsLoading(true);
            if (isEdit) {
                // await RequestManager.post("/updateBounty", data);
            } else {
                await RequestManager.post(`/createRace`, data);
            }
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error));
            return;
        } finally {
            setIsLoading(false);
        }

        updateDndRaces();
        closeForm();
    }

    return <Modal open={isOpen} onClose={closeForm}>
        <DialogContent>
            <BasicForm
                title={isEdit ? "Update Race" : "Add Race"}
                onSubmit={onSubmit}
                isSubmitting={isLoading}
                errorMessage={errorMessage}
                closeForm={closeForm}
                defaultValues={dndRace ?? defaultRace}
            >
                <Grid container spacing={2} className="mb-2">
                    <Grid size={12}>
                        <TextInput
                            label="Name"
                            fieldName="name"
                            requiredMessage="Name is required"
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextInput
                            label="Description"
                            fieldName="description"
                            requiredMessage="Description is required"
                            multilineRows={4}
                        />
                    </Grid>
                    <Grid size={12}>
                        {/* <ListInput
                            title={"Traits"}
                            fieldName={"traits"}
                            defaultItem={{ name: "", description: "" }}
                            addText={"Add Trait"}
                            listItemComponent={({ idx, removeButton }) => (
                                <Grid container spacing={2} key={idx}>
                                    <Grid size={3}>
                                        <Typography variant="body1">Name</Typography>
                                    </Grid>
                                    <Grid size={8}>
                                        <Typography variant="body1">Description</Typography>
                                    </Grid>
                                    <Grid size={1}>{removeButton}</Grid>
                                </Grid>
                            )}
                        /> */}
                    </Grid>
                </Grid>
            </BasicForm>
        </DialogContent>
    </Modal>
}