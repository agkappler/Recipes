import { getRelativeUrlInfo } from "@/app/_api/dnd5eapi";
import { Grid, Paper, Typography, Button, Box } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import useSWR from "swr";
import { LoadingWrapper } from "../../ui/LoadingWrapper";
import { DescriptionList } from "../DescriptionList";
import { CreatingSpellSlotsTable } from "./class-specific/CreatingSpellSlotsTable";
import { FeatureAndLevel } from "./ClassFeatures";
import { AbilityForm } from "../abilities/AbilityForm";
import { AbilitySource } from "@/app/_constants/AbilitySource";

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
            <Paper elevation={3} className="m-2 p-2">
                <Grid container>
                    <Grid size={2} />
                    <Grid size={8}>
                        <Typography variant="subtitle1" fontWeight="bold" textAlign="center">{feature.name}</Typography>
                    </Grid>
                    <Grid size={2}>
                        <Typography variant="body1" fontWeight="light" textAlign="right">Level {featureInfo?.level}</Typography>
                    </Grid>
                </Grid>
                <LoadingWrapper isLoading={isLoading} size={10}>
                    <DescriptionList descriptions={featureInfo?.desc} />
                    {featureInfo?.index === 'flexible-casting-creating-spell-slots' &&
                        <CreatingSpellSlotsTable creatingSpellSlots={feature.levelInfo.class_specific.creating_spell_slots} />
                    }
                    {characterId && featureInfo && (
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
                </LoadingWrapper>
            </Paper>
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