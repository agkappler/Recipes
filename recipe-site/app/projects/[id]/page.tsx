import { ProjectHeader } from "@/app/_components/home/ProjectHeader";
import { ProjectTodos } from "@/app/_components/home/ProjectTodos";
import { LinkButton } from "@/app/_components/ui/LinkButton";
import { PageHeader } from "@/app/_components/ui/PageHeader";
import { PROJECTS } from "@/app/_constants/Projects";
import SlugProps from "@/app/_helpers/SlugProps";
import { Box, Typography } from "@mui/material";

export default function ProjectPage({ params }: SlugProps) {
    const project = PROJECTS[Number(params.id)];
    return (
        <Box>
            <PageHeader
                leftContainer={<LinkButton label="All Projects" url="/" isForward={false} />}
                rightContainer={project.url ? <LinkButton label="View Project" url={project.url} /> : undefined}
            >
                <ProjectHeader project={project} />
            </PageHeader>
            <Typography variant="body1" textAlign="center">{project.description}</Typography>
            <ProjectTodos todos={project.todo} />
        </Box>
    );
}