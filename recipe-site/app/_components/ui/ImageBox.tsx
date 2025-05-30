import RequestManager from "@/app/_helpers/RequestManager";
import Image from "next/image";
import useSWR from "swr";
import { LoadingWrapper } from "./LoadingWrapper";
import FileMetadata from "@/app/_models/FileMetadata";
import { Box } from "@mui/material";

interface ImageBoxProps {
    fileId: number;
    altText: string;
}

export const ImageBox: React.FC<ImageBoxProps> = ({ fileId, altText }) => {
    const errorRetry = (error: any, key: any, config: any, revalidate: any, { retryCount }: { retryCount: number }) => {
        if (retryCount >= 2) return;
        setTimeout(() => revalidate({ retryCount }), 5000);
    }
    const { data: fileMetadata, isLoading, error } = useSWR<FileMetadata>(`/fileUrl/${fileId}`, () => RequestManager.get(`/fileUrl/${fileId}`), { onErrorRetry: errorRetry });
    return <LoadingWrapper isLoading={isLoading} size={20}>
        <Box margin="auto" borderRadius={100} overflow="hidden" width={100}>
            {fileMetadata?.url && <Image src={fileMetadata.url} alt={altText} width={200} height={200} />}
        </Box>
    </LoadingWrapper>
}