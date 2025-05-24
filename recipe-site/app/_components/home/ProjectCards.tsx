'use client';

import { PROJECTS } from "@/app/_constants/Projects";
import { Box, Grid, Link, Paper, Typography } from "@mui/material";
import { StatusChip } from "../ui/StatusChip";
import { ProjectHeader } from "./ProjectHeader";

export const ProjectCards = () => {
    return (
        <Grid container spacing={2} className="mx-2 mt-2">
            {PROJECTS.map((project, index) => (<Grid key={index} size={6} gap={2} className="flex flex-col items-center">
                <Paper key={index} elevation={3} className="flex flex-col items-center justify-center w-full p-2">
                    <ProjectHeader project={project} />
                    <StatusChip label={project.status} />
                    <Typography variant="body1" textAlign="center">{project.description}</Typography>
                    <Box className="flex flex-row justify-between w-full">
                        <Link href={`/projects/${index}`}>Project Details</Link>
                        <Link href={project.url}>View Project</Link>
                    </Box>
                </Paper>
            </Grid>))}
        </Grid>
    );
}