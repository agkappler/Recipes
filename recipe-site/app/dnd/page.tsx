'use client';

import { Box, Grid, Typography } from "@mui/material";
import { PageHeader } from "../_components/ui/PageHeader";
import useSWR from "swr";
// import { getAllSpells } from "../api/dnd";

export default function Dnd() {
    // const { data, isLoading } = useSWR("/classes", () => getAllSpells());
    // if (isLoading) {
    //     return <Typography variant="body1">Loading Dungeons and Dragons data...</Typography>;
    // }
    const data = { results: [] };

    return (
        <Box className="mx-2">
            <PageHeader title="Dungeons and Dragons" />
            <Typography variant="body1">Welcome to the Dungeons and Dragons page!</Typography>
            <Grid container spacing={1}>
                {data.results.map((spell: any) => (
                    <Typography variant="body1" key={spell.index}>{spell.name}</Typography>
                ))}
            </Grid>
        </Box>
    );
}