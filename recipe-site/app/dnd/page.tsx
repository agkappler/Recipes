'use client';

import { Box, Button, Grid, Typography } from "@mui/material";
import { PageHeader } from "../_components/ui/PageHeader";
import useSWR from "swr";
import { DndClassResponse, DndItem, DndRaceResponse, getAllSpells, getClass, getClasses, getRaces, getSubclasses, getSubraces } from "../api/dnd5eapi";
import { LoadingWrapper } from "../_components/ui/LoadingWrapper";
import RequestManager from "../_helpers/RequestManager";
import Character from "../_models/Character";
import { CharacterForm } from "../_components/dnd/CharacterForm";
import { useState } from "react";
import { getOpen5eClasses, getOpen5eRaces } from "../api/open5e";

export default function Dnd() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState<Character>();
    const onClose = () => {
        setIsOpen(false);
        setSelectedCharacter(undefined);
    }

    // const { data: spellData, isLoading: isLoadingSpells } = useSWR("/spells", () => getAllSpells());
    const { data: classData, isLoading: isLoadingClasses } = useSWR<{ results: DndItem[] }>("/classes", () => getClasses());
    const { data: raceData, isLoading: isLoadingRaces } = useSWR<{ results: DndItem[] }>("/races", () => getRaces());

    // W/homebrew stuff.
    // const { data: classes } = useSWR<{ results: any[] }>("/classes5e", () => getOpen5eClasses());
    // const { data: races } = useSWR<{ results: any[] }>("/races5e", () => getOpen5eRaces());
    // const racesOpen5e = races?.map(r => ({ value: r.slug, label: r.name })) ?? [],
    //     classesOpen5e = classes?.map(c => ({ value: c.slug, label: c.name })) ?? [];
    // const subracesOpen5e = races.find(r => r.slug === "dwarf")?.subraces?.map((s: any) => ({ value: s.slug, label: s.name })) ?? [],
    //     subclassesOpen5e = classes.find(r => r.slug === "monk")?.archetypes?.map((a: any) => ({ value: a.slug, label: a.name })) ?? [];


    const { data: characters, isLoading, mutate } = useSWR<Character[]>("/characters", () => RequestManager.get("/characters"));

    return (<>
        <Box className="mx-2">
            <PageHeader title="Dungeons and Dragons" />
            <Typography variant="body1">Welcome to the Dungeons and Dragons page!</Typography>
            <LoadingWrapper isLoading={isLoadingClasses} size={20}>
                {classData?.results.map((cClass: any) => (
                    <Typography variant="body1" key={cClass.index}>{cClass.name}</Typography>
                ))}
            </LoadingWrapper>
            {/* <LoadingWrapper isLoading={isLoadingSpells} size={20}>
                {spellData.results.map((spell: any) => (
                    <Typography variant="body1" key={spell.index}>{spell.name}</Typography>
                ))}
            </LoadingWrapper> */}
            <Typography variant="h6">Characters</Typography>
            <Button onClick={() => setIsOpen(true)}>Add Character</Button>
            <LoadingWrapper isLoading={isLoading}>
                <Grid container spacing={1}>
                    {characters?.map((c) => (<Grid key={c.characterId} size={3}>
                        <Typography variant="subtitle1">{c.name}</Typography>
                    </Grid>))}
                </Grid>
            </LoadingWrapper>
        </Box>
        <CharacterForm
            isOpen={isOpen}
            onClose={onClose}
            updateCharacters={mutate}
            character={selectedCharacter}
            classes={classData?.results ?? []}
            races={raceData?.results ?? []}
        />
    </>
    );
}