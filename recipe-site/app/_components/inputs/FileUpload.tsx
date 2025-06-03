import { Avatar, Box, Button, IconButton, styled } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FileRole } from "@/app/_constants/FileRole";
import RequestManager from "@/app/_helpers/RequestManager";
import { ChangeEvent, ChangeEventHandler, useRef, useState } from "react";
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
    isAvatar?: boolean;
}

export const FileUpload: React.FC<FileUploadButtonProps> = ({ fileRole, label = "Upload Files", onUpload, isAvatar = true }) => {
    const size = "100px";
    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileRole', fileRole);
        const fileMetadata: FileMetadata = await RequestManager.uploadFile(formData);
        if (onUpload) await onUpload(fileMetadata);

        return fileMetadata.url ?? "";
    }

    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const url = await uploadFile(file);
        setImageUrl(url);
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            {isAvatar
                ? <IconButton onClick={handleClick} sx={{ width: size, height: size }}>
                    <Avatar
                        src={imageUrl}
                        sx={{ width: size, height: size, border: "2px dashed #aaa", bgcolor: "#f5f5f5" }}
                    >
                        {!imageUrl && <CloudUploadIcon fontSize="large" />}
                    </Avatar>
                </IconButton>
                : <Button
                    onClick={handleClick}
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                >
                    {label}
                </Button>
            }
            <input
                ref={inputRef}
                type="file"
                accept={isAvatar ? "image/*" : "*/*"}
                style={{ display: "none" }}
                onChange={handleChange}
            />
        </Box>
    );
}