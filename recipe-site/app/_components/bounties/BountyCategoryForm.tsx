import RequestManager from "@/app/_helpers/RequestManager";
import BountyCategory from "@/app/_models/BountyCategory";
import { DialogContent, Modal } from "@mui/material";
import { useState } from "react";
import { BasicForm } from "../inputs/BasicForm";
import { TextInput } from "../inputs/TextInput";

interface BountyCategoryFormProps {
    isOpen: boolean;
    onClose: () => void;
    updateBountyCategories: () => void;
}

export const BountyCategoryForm: React.FC<BountyCategoryFormProps> = ({ onClose, isOpen, updateBountyCategories }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>();

    const closeForm = () => {
        setErrorMessage(undefined);
        onClose();
    }

    const onSubmit = async (data: BountyCategory) => {
        try {
            setIsLoading(true);
            await RequestManager.post(`/createBountyCategory`, data);
        } catch (error: ErrorEvent | any) {
            setErrorMessage(error.message);
            return;
        } finally {
            setIsLoading(false);
        }

        updateBountyCategories();
        closeForm();
    }

    return <Modal open={isOpen} onClose={closeForm}>
        <DialogContent>
            <BasicForm
                title="Add Bounty Category"
                onSubmit={onSubmit}
                isSubmitting={isLoading}
                errorMessage={errorMessage}
                closeForm={closeForm}
            >
                <TextInput
                    label="Name"
                    fieldName="name"
                    requiredMessage="Name is required"
                />
            </BasicForm>
        </DialogContent>
    </Modal>
}