import RequestManager from "@/app/_helpers/RequestManager";
import SubclassFeature from "@/app/_models/SubclassFeature";
import { Box, Typography } from "@mui/material";
import useSWR from "swr";
import { LoadingWrapper } from "../../ui/LoadingWrapper";
import { FeatureItem } from "./FeatureItem";

interface CustomSubclassInfoProps {
    subclassId: number;
}

export const CustomSubclassInfo: React.FC<CustomSubclassInfoProps> = ({ subclassId }) => {
    const { data: subclassFeatures, isLoading } = useSWR<SubclassFeature[]>(`/subclasses/${subclassId}/features`, () => RequestManager.get<SubclassFeature[]>(`/subclasses/${subclassId}/features`));

    return <>
        <LoadingWrapper isLoading={isLoading}>
            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                {(!subclassFeatures || subclassFeatures.length === 0) && (
                    <Typography variant="body1">No features yet!</Typography>
                )}
                {subclassFeatures?.map((feature: SubclassFeature, index: number) => (
                    <FeatureItem
                        key={index}
                        name={feature.name}
                        level={feature.level}
                        descriptions={[feature.description]}
                    />
                ))}
            </Box>
        </LoadingWrapper>
    </>
}
