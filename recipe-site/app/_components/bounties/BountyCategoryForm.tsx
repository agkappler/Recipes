import { getErrorMessage } from "@/app/_helpers/Errors";
import RequestManager from "@/app/_helpers/RequestManager";
import BountyCategory from "@/app/_models/BountyCategory";
import { useState } from "react";
import { BasicForm } from "../inputs/BasicForm";
import { TextInput } from "../inputs/TextInput";
import { SimpleDialog } from "../ui/SimpleDialog";

interface BountyCategoryFormProps {
    isOpen: boolean;
    onClose: () => void;
    updateBountyCategories: () => void;
}

export const BountyCategoryForm: React.FC<BountyCategoryFormProps> = ({ onClose, isOpen, updateBountyCategories }) => {
    const [errorMessage, setErrorMessage] = useState<string>();

    const closeForm = () => {
        setErrorMessage(undefined);
        onClose();
    }

    const onSubmit = async (data: BountyCategory) => {
        try {
            await RequestManager.post(`/createBountyCategory`, data);
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error));
            return;
        }

        updateBountyCategories();
        closeForm();
    }

    return <SimpleDialog title="Add Bounty Category" isOpen={isOpen} onClose={closeForm}>
        <BasicForm
            onSubmit={onSubmit}
            errorMessage={errorMessage}
            closeForm={closeForm}
        >
            <TextInput
                label="Name"
                fieldName="name"
                requiredMessage="Name is required"
            />
        </BasicForm>
    </SimpleDialog>
}