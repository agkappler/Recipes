import RequestManager from "@/app/_helpers/RequestManager";
import FileMetadata from "@/app/_models/FileMetadata";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Link } from "@mui/material";
import Image from "next/image";
import useSWR from "swr";
import { LoadingWrapper } from "./LoadingWrapper";

interface FileWrapperProps {
    fileId: number;
}

export const FileWrapper: React.FC<FileWrapperProps> = ({ fileId }) => {
    const errorRetry = (_: any, key: any, config: any, revalidate: any, { retryCount }: { retryCount: number }) => {
        if (retryCount >= 2) return;
        setTimeout(() => revalidate({ retryCount }), 5000);
    }
    const { data: fileMetadata, isLoading } = useSWR<FileMetadata>(`/fileUrl/${fileId}`, () => RequestManager.get<FileMetadata>(`/fileUrl/${fileId}`), { onErrorRetry: errorRetry });
    const isImage = (filename: string) => ["jpg", "jpeg", "png", "gif", "webp"].includes(filename.split('.').pop()?.toLowerCase() || "");

    return <LoadingWrapper isLoading={isLoading} size={100}>
        {fileMetadata && (
            <Link href={fileMetadata.url} target="_blank" rel="noopener noreferrer" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {isImage(fileMetadata.filename) && fileMetadata.url
                    ? (
                        <Image
                            src={fileMetadata.url}
                            alt={fileMetadata.filename}
                            width={100}
                            height={100}
                            style={{ objectFit: "cover", borderRadius: 8, marginBottom: 8 }}
                        />
                    ) : (
                        <InsertDriveFileIcon sx={{ fontSize: 64, color: "action.active", marginBottom: 1 }} />
                    )
                }
                {fileMetadata.filename}
            </Link>
        )}
    </LoadingWrapper>
}