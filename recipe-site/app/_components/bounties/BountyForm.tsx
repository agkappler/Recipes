import RequestManager from "@/app/_helpers/RequestManager";
import Bounty from "@/app/_models/Bounty";
import BountyCategory from "@/app/_models/BountyCategory";
import { DialogContent, Grid, Modal } from "@mui/material";
import { useState } from "react";
import { BasicForm } from "../inputs/BasicForm";
import { DropdownInput } from "../inputs/DropdownInput";
import { TextInput } from "../inputs/TextInput";

interface BountyFormProps {
    isOpen: boolean;
    onClose: () => void;
    bounty?: Bounty;
    updateBounties: () => void;
    bountyCategories: BountyCategory[]
}

export const BountyForm: React.FC<BountyFormProps> = ({ isOpen, onClose, bounty, bountyCategories, updateBounties }) => {
    const isEdit = bounty !== undefined;
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const closeForm = () => {
        setErrorMessage(undefined);
        onClose();
    }

    const onSubmit = async (data: Bounty) => {
        try {
            setIsLoading(true);
            if (isEdit) {
                // await RequestManager.post("/updateIngredient", data);
            } else {
                data.status = "IN_PROGRESS";
                await RequestManager.post(`/createBounty`, data);
            }
        } catch (error: ErrorEvent | any) {
            setErrorMessage(error.message);
            return;
        } finally {
            setIsLoading(false);
        }

        updateBounties();
        closeForm();
    }

    return <Modal open={isOpen} onClose={closeForm}>
        <DialogContent>
            <BasicForm
                title={isEdit ? "Update Bounty" : "Post Bounty"}
                onSubmit={onSubmit}
                isSubmitting={isLoading}
                errorMessage={errorMessage}
                closeForm={closeForm}
            >
                <Grid container spacing={2} className="mb-2">
                    <Grid size={6}>
                        <TextInput
                            label="Title"
                            fieldName="title"
                            requiredMessage="Title is required"
                        />
                    </Grid>
                    <Grid size={6}>
                        <DropdownInput
                            label="Category"
                            fieldName="categoryId"
                            options={bountyCategories.map(category => ({
                                value: category.categoryId,
                                label: category.name
                            }))}
                            requiredMessage="Category is required"
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
                </Grid>
            </BasicForm>
        </DialogContent>
    </Modal>
}