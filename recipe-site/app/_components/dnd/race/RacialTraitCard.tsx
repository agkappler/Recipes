import { DndItem, getRelativeUrlInfo } from "@/app/_api/dnd5eapi";
import { Paper, Typography, Button, Box } from "@mui/material";
import { Add } from "@mui/icons-material";
import React, { useState } from "react";
import useSWR from "swr";
import { LoadingWrapper } from "../../ui/LoadingWrapper";
import { OptionsList } from "../OptionsList";
import { DraconicAncestryTable } from "./DraconicAncestryTable";
import { AbilityForm } from "../abilities/AbilityForm";
import { AbilitySource } from "@/app/_constants/AbilitySource";

interface RacialTraitCardProps {
    trait: DndItem;
    characterId?: number;
    raceName?: string;
}

export const RacialTraitCard: React.FC<RacialTraitCardProps> = ({ trait, characterId, raceName }) => {
    const { data: traitInfo, isLoading } = useSWR(trait.index, () => getRelativeUrlInfo(trait.url));
    const [isAbilityFormOpen, setIsAbilityFormOpen] = useState(false);

    const getTraitDescription = () => {
        if (!traitInfo?.desc) return "";
        return traitInfo.desc.join(" ");
    };

    return (
        <>
            <Paper elevation={3} className="p-2 m-2">
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
                        {characterId && (
                            <Box display="flex" justifyContent="center" mt={2}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Add />}
                                    onClick={() => setIsAbilityFormOpen(true)}
                                >
                                    Create Ability
                                </Button>
                            </Box>
                        )}
                    </>}
                </LoadingWrapper>
            </Paper>
            {characterId && (
                <AbilityForm
                    isOpen={isAbilityFormOpen}
                    onClose={() => setIsAbilityFormOpen(false)}
                    characterId={characterId}
                    defaultSource={AbilitySource.Race}
                    defaultSourceDescription={raceName || "Race"}
                    defaultName={trait.name}
                    defaultDescription={getTraitDescription()}
                />
            )}
        </>
    );
}