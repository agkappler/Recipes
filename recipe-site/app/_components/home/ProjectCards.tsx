'use client';

import { PROJECTS } from "@/app/_constants/Projects";
import { Grid, Link, Paper, Typography } from "@mui/material";
import { StatusChip } from "../ui/StatusChip";
import { ProjectHeader } from "./ProjectHeader";

export const ProjectCards = () => {
    return (
        <Grid container spacing={2} className="mx-2">
            {PROJECTS.map((project, index) => (<Grid key={index} size={6} className="flex flex-col items-center">
                <Paper key={index} elevation={3} className="flex flex-col items-center justify-center w-full m-2 p-2">
                    <Link href={`/projects/${index}`}><ProjectHeader project={project} /></Link>
                    <StatusChip label={project.status} />
                    <Typography variant="body1" textAlign="center">{project.description}</Typography>
                </Paper>
            </Grid>))}
        </Grid>
    );
}