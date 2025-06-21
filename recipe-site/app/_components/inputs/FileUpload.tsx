'use client';

import { FileRole } from "@/app/_constants/FileRole";
import RequestManager from "@/app/_helpers/RequestManager";
import FileMetadata from "@/app/_models/FileMetadata";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Avatar, Box, Button, IconButton } from "@mui/material";
import { useRef, useState } from "react";
import useSWR from "swr";

interface FileUploadButtonProps {
    fileRole: FileRole;
    label?: string;
    onUpload?: (fileMetadata: FileMetadata) => Promise<void>;
    isAvatar?: boolean;
    currentAvatarId?: number;
}

export const FileUpload: React.FC<FileUploadButtonProps> = ({ fileRole, label = "Upload Files", onUpload, isAvatar = false, currentAvatarId }) => {
    const size = "100px";
    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileRole', fileRole);
        const fileMetadata: FileMetadata = await RequestManager.uploadFile(formData);
        if (onUpload) await onUpload(fileMetadata);

        return fileMetadata.url ?? "";
    }

    const { data: currentAvatarUrl } = useSWR<FileMetadata | undefined>(`/fileUrl/${currentAvatarId}`, currentAvatarId !== undefined ? () => RequestManager.get<FileMetadata>(`/fileUrl/${currentAvatarId}`) : () => Promise.resolve(undefined), { onSuccess: (data) => setImageUrl(data?.url) });
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
                        src={currentAvatarUrl?.url || imageUrl}
                        sx={{ width: size, height: size, border: "2px dashed #aaa", bgcolor: "#f5f5f5" }}
                    >
                        <CloudUploadIcon fontSize="large" />
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