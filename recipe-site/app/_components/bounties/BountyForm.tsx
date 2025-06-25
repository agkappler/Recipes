import { BOUNTY_STATUS_OPTIONS, BountyStatus } from "@/app/_constants/Status";
import { getErrorMessage } from "@/app/_helpers/Errors";
import RequestManager from "@/app/_helpers/RequestManager";
import Bounty from "@/app/_models/Bounty";
import BountyCategory from "@/app/_models/BountyCategory";
import { Grid } from "@mui/material";
import { useState } from "react";
import { BasicForm } from "../inputs/BasicForm";
import { DropdownInput } from "../inputs/DropdownInput";
import { TextInput } from "../inputs/TextInput";
import { SimpleDialog } from "../ui/SimpleDialog";

interface BountyFormProps {
    isOpen: boolean;
    onClose: () => void;
    bounty?: Bounty;
    updateBounties: () => void;
    bountyCategories: BountyCategory[];
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
                await RequestManager.post("/updateBounty", data);
            } else {
                data.status = BountyStatus.Active;
                await RequestManager.post(`/createBounty`, data);
            }
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error));
            return;
        } finally {
            setIsLoading(false);
        }

        updateBounties();
        closeForm();
    }

    return <SimpleDialog title={isEdit ? "Update Bounty" : "Post Bounty"} isOpen={isOpen} onClose={closeForm}>
        <BasicForm
            onSubmit={onSubmit}
            isSubmitting={isLoading}
            errorMessage={errorMessage}
            closeForm={closeForm}
            defaultValues={bounty}
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
                {isEdit && <Grid size={6}>
                    <DropdownInput
                        label="Status"
                        fieldName="status"
                        options={BOUNTY_STATUS_OPTIONS}
                    />
                </Grid>}
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
    </SimpleDialog>
}