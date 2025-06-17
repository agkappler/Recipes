import { Box, Typography } from "@mui/material";
import { StatusChip } from "../ui/StatusChip";
import { ProjectHeader } from "./ProjectHeader";
import { LinkButton } from "../ui/buttons/LinkButton";

interface ProjectCardProps {
    project: any;
    index: number;
}

export const ProjectCardContents: React.FC<ProjectCardProps> = ({ project, index }) => {
    return <>
        <ProjectHeader project={project} />
        <StatusChip label={project.status} />
        <Typography variant="body1" textAlign="center">{project.description}</Typography>
        <Box display="flex" justifyContent="center" gap={2}>
            <LinkButton label="Details" url={`/projects/${index}`} />
            <LinkButton label="Project" url={project.url} />
            {/* <Button
                    variant="contained"
                    color="primary"
                    href={`/projects/${index}`}
                >
                    Project Details
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    href={project.url}
                >
                    View Project
                </Button> */}
        </Box>
    </>
}