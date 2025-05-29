import { DndItem, getRelativeUrlInfo, LevelInfo } from "@/app/api/dnd5eapi";
import { Grid, Paper, Typography } from "@mui/material";
import useSWR from "swr";
import { LoadingWrapper } from "../../ui/LoadingWrapper";
import { CreatingSpellSlotsTable } from "./class-specific/CreatingSpellSlotsTable";
import { DescriptionList } from "../DescriptionList";

interface FeatureCardProps {
    feature: DndItem & { levelInfo: LevelInfo };
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
    const { data: featureInfo, isLoading } = useSWR(feature.url, () => getRelativeUrlInfo(feature.url));

    return <Paper elevation={3} className="m-2 p-2">
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
            {/* TODO: Add feature specific info. */}
        </LoadingWrapper>
    </Paper>
}