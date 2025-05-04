import { Checklist, Description, ListAlt } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Paper, Typography } from "@mui/material";
import { StatusChip } from "../ui/StatusChip";
import { ProjectStatus } from "@/app/_constants/Status";

export const ProjectCards = () => {
    const projects = [
        {
            id: 1,
            name: "Recipes",
            description: "This is an app to hold recipes with custom portions.",
            imageUrl: "https://via.placeholder.com/150",
            status: ProjectStatus.InProgress,
            icon: <ListAlt />,
            todo: [
                "About page, w/linked in photo and link.",
                "Recipe Card List",
                "Recipe create and edit forms",
                "Stores/request manager?",
            ]
        },
        {
            id: 2,
            name: "Daily Bounties",
            description: "This converts repeatable tasks into bounties, similar to a video game.",
            imageUrl: "https://via.placeholder.com/150",
            status: ProjectStatus.Concept,
            icon: <Checklist />,
            todo: ["DB"]
        },
        {
            id: 3,
            name: "DND Character Sheet",
            description: "This is a simple character sheet for D&D.",
            imageUrl: "https://via.placeholder.com/150",
            status: ProjectStatus.Concept,
            icon: <Description />,
            todo: ["Explore api", "Figure out desired features"]
        },
    ]

    return (
        <Box className="mx-2">
            {projects.map((project, index) => (<Paper key={index} elevation={3} className="flex flex-col items-center justify-center w-full m-2">
                <Box className="flex items-center">
                    {project.icon}
                    <Typography variant="h6">{project.name}</Typography>
                </Box>
                <StatusChip label={project.status} />
                <Typography variant="body1">{project.description}</Typography>
                <Accordion>
                    <AccordionSummary>
                        <Typography variant="subtitle1">Todo:</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ul>
                            {project.todo.map((item, index) => (
                                <li key={index}>
                                    <Typography variant="body2">{item}</Typography>
                                </li>
                            ))}
                        </ul>
                    </AccordionDetails>
                </Accordion>
            </Paper>))}
        </Box>
    );
}