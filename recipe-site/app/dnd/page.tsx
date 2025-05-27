'use client';

import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import { CharacterCard } from "../_components/dnd/CharacterCard";
import { CharacterForm } from "../_components/dnd/CharacterForm";
import { AddModelCard } from "../_components/ui/AddModelCard";
import { LoadingWrapper } from "../_components/ui/LoadingWrapper";
import { PageHeader } from "../_components/ui/PageHeader";
import RequestManager from "../_helpers/RequestManager";
import Character from "../_models/Character";

export default function Dnd() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState<Character>();
    const onClose = () => {
        setIsOpen(false);
        setSelectedCharacter(undefined);
    }
    const { data: characters, isLoading, mutate } = useSWR<Character[]>("/characters", () => RequestManager.get("/characters"));

    return (<>
        <Box className="mx-2">
            <PageHeader title="Dungeons and Dragons" />
            <Typography variant="h6" mt={2}>Characters:</Typography>
            <LoadingWrapper isLoading={isLoading}>
                <Grid container spacing={1}>
                    <Grid size={3}>
                        <AddModelCard onClick={() => setIsOpen(true)} title="Create Character" />
                    </Grid>
                    {characters?.map((c) => (
                        <Grid key={c.characterId} size={3}>
                            <CharacterCard character={c} />
                        </Grid>
                    ))}
                </Grid>
            </LoadingWrapper>
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