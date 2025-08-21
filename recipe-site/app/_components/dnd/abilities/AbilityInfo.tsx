import { AbilitySource } from "@/app/_constants/AbilitySource";
import RequestManager from "@/app/_helpers/RequestManager";
import Ability from "@/app/_models/Ability";
import { Grid, Typography } from "@mui/material";
import useSWR from "swr";
import { LoadingWrapper } from "../../ui/LoadingWrapper";
import { AbilityCard } from "./AbilityCard";

interface AbilityInfoProps {
    characterId: number;
    canEdit: boolean;
}

export const AbilityInfo: React.FC<AbilityInfoProps> = ({ characterId, canEdit }) => {
    const { data: abilities, isLoading, mutate } = useSWR<Ability[]>(
        `/characterAbilities/${characterId}`,
        () => RequestManager.get<Ability[]>(`/characterAbilities/${characterId}`)
    );

    const sortAbilitiesByType = (abilities: Ability[]) => {
        const sourceOrder = [AbilitySource.Class, AbilitySource.Race, AbilitySource.Feat, AbilitySource.Other];

        return abilities.sort((a, b) => {
            const aIndex = sourceOrder.indexOf(a.source);
            const bIndex = sourceOrder.indexOf(b.source);

            if (aIndex !== bIndex) {
                return aIndex - bIndex;
            }

            // If same source type, sort by name
            return a.name.localeCompare(b.name);
        });
    };

    const sortedAbilities = abilities ? sortAbilitiesByType(abilities) : [];

    return (
        <LoadingWrapper isLoading={isLoading}>
            {sortedAbilities.length > 0 ? (
                <Grid container spacing={2}>
                    {sortedAbilities.map((ability) => (
                        <Grid key={ability.abilityId} size={{ xs: 12, sm: 6, md: 4 }}>
                            <AbilityCard
                                ability={ability}
                                characterId={characterId}
                                canEdit={canEdit}
                                onAbilityUpdate={mutate}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography textAlign="center">No abilities found for this character.</Typography>
            )}
        </LoadingWrapper>
    );
};
