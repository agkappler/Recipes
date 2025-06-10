import { DndItem, getRelativeUrlInfo } from "@/app/api/dnd5eapi";
import { Paper, Typography } from "@mui/material";
import React from "react";
import useSWR from "swr";
import { LoadingWrapper } from "../../ui/LoadingWrapper";
import { OptionsList } from "../OptionsList";
import { DraconicAncestryTable } from "./DraconicAncestryTable";

interface RacialTraitCardProps {
    trait: DndItem;
}

export const RacialTraitCard: React.FC<RacialTraitCardProps> = ({ trait }) => {
    const { data: traitInfo, isLoading } = useSWR(trait.index, () => getRelativeUrlInfo(trait.url));
    return <Paper elevation={3} className="p-2 m-2">
        <Typography variant="subtitle1" fontWeight="bold" textAlign="center">{trait.name}</Typography>
        <LoadingWrapper isLoading={isLoading} size={20}>
            {traitInfo && <>
                {traitInfo.desc.map((d: string, index: number) => (
                    <Typography key={index} variant="body1" textAlign="center">{d}</Typography>
                ))}
                {traitInfo.trait_specific && (
                    traitInfo.index === 'draconic-ancestry'
                        ? <DraconicAncestryTable subOptions={traitInfo.trait_specific.subtrait_options} />
                        : <OptionsList subOptions={traitInfo.trait_specific.subtrait_options ?? traitInfo.trait_specific.spell_options} />
                )}
            </>}
        </LoadingWrapper>
    </Paper>
}