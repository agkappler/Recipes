import { getRelativeUrlInfo } from "@/app/_api/dnd5eapi";
import { AbilitySource } from "@/app/_constants/Abilities";
import { Add } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import { LoadingWrapper } from "../../ui/LoadingWrapper";
import { AbilityForm } from "../abilities/AbilityForm";
import { DescriptionList } from "../DescriptionList";
import { CreatingSpellSlotsTable } from "./class-specific/CreatingSpellSlotsTable";
import { FeatureAndLevel } from "./ClassFeatures";

interface FeatureCardProps {
    feature: FeatureAndLevel;
    characterId?: number;
    className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature, characterId, className }) => {
    const { data: featureInfo, isLoading } = useSWR(feature.url, () => getRelativeUrlInfo(feature.url));
    const [isAbilityFormOpen, setIsAbilityFormOpen] = useState(false);

    const getFeatureDescription = () => {
        if (!featureInfo?.desc) return "";
        return featureInfo.desc.join(" ");
    };

    return (
        <>
            <Box className="my-2 p-2 pt-3" borderTop={1} borderColor="divider">
                <Grid container>
                    <Grid size={3}>
                        <Typography variant="body1" fontWeight="light" textAlign="left">Level {featureInfo?.level}</Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography variant="subtitle1" fontWeight="bold" textAlign="center">{feature.name}</Typography>
                    </Grid>
                    <Grid size={3} display="flex" justifyContent="flex-end">
                        {characterId && featureInfo && (
                            <Button
                                variant="text"
                                size="small"
                                startIcon={<Add />}
                                onClick={() => setIsAbilityFormOpen(true)}
                            >
                                Create Ability
                            </Button>
                        )}
                    </Grid>
                </Grid>
                <LoadingWrapper isLoading={isLoading} size={10}>
                    <DescriptionList descriptions={featureInfo?.desc} />
                    {featureInfo?.index === 'flexible-casting-creating-spell-slots' &&
                        <CreatingSpellSlotsTable creatingSpellSlots={feature.levelInfo.class_specific.creating_spell_slots} />
                    }
                </LoadingWrapper>
            </Box>
            {characterId && (
                <AbilityForm
                    isOpen={isAbilityFormOpen}
                    onClose={() => setIsAbilityFormOpen(false)}
                    characterId={characterId}
                    defaultSource={AbilitySource.Class}
                    defaultSourceDescription={className || "Class"}
                    defaultName={feature.name}
                    defaultDescription={getFeatureDescription()}
                />
            )}
        </>
    );
}