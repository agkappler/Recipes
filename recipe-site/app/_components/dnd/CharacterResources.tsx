import { FileRole } from "@/app/_constants/FileRole";
import RequestManager from "@/app/_helpers/RequestManager";
import FileMetadata from "@/app/_models/FileMetadata";
import { Box, Typography } from "@mui/material";
import useSWR from "swr";
import { FileUpload } from "../inputs/FileUpload";
import { FileWrapper } from "../ui/FileWrapper";
import { LoadingWrapper } from "../ui/LoadingWrapper";

interface CharacterResourcesProps {
    characterId: number;
}

export const CharacterResources: React.FC<CharacterResourcesProps> = ({ characterId }) => {
    const { data, isLoading, mutate } = useSWR<number[]>(`/character/${characterId}/resourceIds`, () => RequestManager.get(`/character/${characterId}/resourceIds`));
    const onUpload = async (fileMetadata: FileMetadata) => {
        await RequestManager.post(`/character/addResource?characterId=${characterId}&fileId=${fileMetadata.fileId}`, {});
        mutate();
    }

    return <>
        <FileUpload fileRole={FileRole.CharacterResource} onUpload={onUpload} />
        <LoadingWrapper isLoading={isLoading}>
            <Box display="flex" justifyContent="center">
                {data && data?.length > 0
                    ? data.map(id => (
                        <Box margin={2}>
                            <FileWrapper key={id} fileId={id} />
                        </Box>
                    )) : <Typography textAlign="center">No resources for character {characterId} yet!</Typography>
                }
            </Box>
        </LoadingWrapper>
    </>
}