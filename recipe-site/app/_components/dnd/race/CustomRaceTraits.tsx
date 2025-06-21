import RequestManager from "@/app/_helpers/RequestManager";
import RacialTrait from "@/app/_models/RacialTrait";
import { Paper, Typography } from "@mui/material";
import useSWR from "swr";
import { LoadingWrapper } from "../../ui/LoadingWrapper";

interface CustomRaceTraitsProps {
    raceId: number;
}

export const CustomRaceTraits: React.FC<CustomRaceTraitsProps> = ({ raceId }) => {
    const { data: racialTraits, isLoading } = useSWR(`/traits/${raceId}`, () => RequestManager.get<RacialTrait[]>(`/traits/${raceId}`));
    return <LoadingWrapper isLoading={isLoading}>
        {racialTraits?.map((t: RacialTrait, index: number) => (
            <Paper key={index} elevation={3} className="p-2 m-2">
                <Typography variant="h5" textAlign="center">{t.name}</Typography>
                <Typography variant="subtitle1" fontWeight="bold" textAlign="center">{t.description}</Typography>
            </Paper>
        ))}
    </LoadingWrapper>
}