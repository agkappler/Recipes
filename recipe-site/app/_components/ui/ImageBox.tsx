import RequestManager from "@/app/_helpers/RequestManager";
import FileMetadata from "@/app/_models/FileMetadata";
import { Avatar, Box } from "@mui/material";
import useSWR from "swr";
import { LoadingWrapper } from "./LoadingWrapper";

interface ImageBoxProps {
    fileId: number;
    altText: string;
}

export const ImageBox: React.FC<ImageBoxProps> = ({ fileId, altText }) => {
    const { data: fileMetadata, isLoading } = useSWR<FileMetadata>(`/fileUrl/${fileId}`, () => RequestManager.get<FileMetadata>(`/fileUrl/${fileId}`));
    return <LoadingWrapper isLoading={isLoading} size={100}>
        <Box margin="auto" width={100}>
            <Avatar src={fileMetadata?.url} alt={altText} sx={{ width: 100, height: 100 }} />
        </Box>
    </LoadingWrapper>
}