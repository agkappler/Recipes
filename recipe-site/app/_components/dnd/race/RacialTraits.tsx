import { getRace } from "@/app/api/dnd5eapi";
import { Box, Typography } from "@mui/material";
import useSWR from "swr";
import { LoadingWrapper } from "../../ui/LoadingWrapper";
import { RacialTraitCard } from "./RacialTraitCard";

interface RacialTraitsProps {
    race: string;
}

export const RacialTraits: React.FC<RacialTraitsProps> = ({ race }) => {
    const { data: racialTraits, isLoading } = useSWR(race, () => getRace(race));
    if (racialTraits && racialTraits.trait_specific) console.log('racial traits', racialTraits);
    return <LoadingWrapper isLoading={isLoading}>
        <Typography variant="h5" textAlign="center">{racialTraits?.name}</Typography>
        {racialTraits?.traits.map((t: any) => (<Box margin={2}>
            <RacialTraitCard trait={t} />
        </Box>))}
    </LoadingWrapper>
}