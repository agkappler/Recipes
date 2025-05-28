import { Button, styled } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FileRole } from "@/app/_constants/FileRole";
import RequestManager from "@/app/_helpers/RequestManager";
import { ChangeEvent, ChangeEventHandler } from "react";
import FileMetadata from "@/app/_models/FileMetadata";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface FileUploadButtonProps {
    fileRole: FileRole;
    label?: string;
    onUpload?: (fileMetadata: FileMetadata) => Promise<void>;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({ fileRole, label = "Upload Files", onUpload }) => {
    const uploadFile: ChangeEventHandler<HTMLInputElement> = async (event) => {
        console.log(event.target.files);
        if (!event.target.files) return;
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        formData.append('fileRole', fileRole);
        const fileMetadata: FileMetadata = await RequestManager.uploadFile(formData);
        if (onUpload) await onUpload(fileMetadata);
    }

    return <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
    >
        {label}
        <VisuallyHiddenInput
            type="file"
            onChange={uploadFile}
            multiple
        />
    </Button>
}