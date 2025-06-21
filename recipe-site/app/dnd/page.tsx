'use client';

import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import { CharacterCard } from "../_components/dnd/CharacterCard";
import { CharacterForm } from "../_components/dnd/CharacterForm";
import { ClassList } from "../_components/dnd/class/ClassList";
import { RaceList } from "../_components/dnd/race/RaceList";
import { AddModelCard } from "../_components/ui/AddModelCard";
import { LinkButton } from "../_components/ui/buttons/LinkButton";
import { LoadingWrapper } from "../_components/ui/LoadingWrapper";
import { PageHeader } from "../_components/ui/PageHeader";
import { Project } from "../_constants/Projects";
import RequestManager from "../_helpers/RequestManager";
import Character from "../_models/Character";

export default function Dnd() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState<Character>();
    const onClose = () => {
        setIsOpen(false);
        setSelectedCharacter(undefined);
    }
    const { data: characters, isLoading, mutate } = useSWR<Character[]>("/characters", () => RequestManager.get<Character[]>("/characters"));

    return (<>
        <PageHeader title="Dungeons & Dragons" rightContainer={<LinkButton url={`/projects/${Project.DnD}`} label="Project Details" />} />
        <Box className="px-2">
            <Typography variant="h5" textAlign="center">Character Catalog</Typography>
            <LoadingWrapper isLoading={isLoading}>
                <Grid container spacing={1}>
                    <Grid size={{ sm: 3, xs: 12 }}>
                        <AddModelCard onClick={() => setIsOpen(true)} title="Create Character" />
                    </Grid>
                    {characters?.map((c) => (
                        <Grid key={c.characterId} size={{ sm: 3, xs: 12 }}>
                            <CharacterCard character={c} />
                        </Grid>
                    ))}
                </Grid>
            </LoadingWrapper>
        </Box>
        <Box className="px-2 mt-2">
            <RaceList />
        </Box>
        <Box className="px-2 mt-2">
            <ClassList />
        </Box>
        <CharacterForm
            isOpen={isOpen}
            onClose={onClose}
            updateCharacters={mutate}
            character={selectedCharacter}
        />
    </>
    );
}