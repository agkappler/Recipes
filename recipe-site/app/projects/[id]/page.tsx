import { ProjectHeader } from "@/app/_components/home/ProjectHeader";
import { ProjectTodos } from "@/app/_components/home/ProjectTodos";
import { LinkButton } from "@/app/_components/ui/buttons/LinkButton";
import { PageHeader } from "@/app/_components/ui/PageHeader";
import { PROJECTS } from "@/app/_constants/Projects";
import SlugProps from "@/app/_helpers/SlugProps";
import { Grid, Paper, Typography } from "@mui/material";

export default function ProjectPage({ params }: SlugProps) {
    const project = PROJECTS[Number(params.id)];
    return (<>
        <PageHeader
            leftContainer={<LinkButton label="All Projects" url="/projects" isForward={false} />}
            rightContainer={project.url ? <LinkButton label="View Project" url={project.url} /> : undefined}
        >
            <ProjectHeader project={project} variant="h4" />
        </PageHeader>
        <Typography variant="body1" textAlign="center">{project.description}</Typography>
        <Grid container spacing={2} className="m-2">
            <Grid size={6}>
                <Paper elevation={3} className="p-2 h-full">
                    <Typography variant="h6" textAlign="center">Motivation</Typography>
                    <Typography variant="body1" textAlign="center">{project.motivation ?? "Divine inspiration."}</Typography>
                </Paper>
            </Grid>
            <Grid size={6}>
                <Paper elevation={3} className="p-2 h-full">
                    <Typography variant="h6" textAlign="center">Vision</Typography>
                    <Typography variant="body1" textAlign="center">{project.vision ?? "I see something, it's too far away to make out clearly yet."}</Typography>
                </Paper>
            </Grid>
            <Grid size={6}>
                <Paper elevation={3} className="p-2 h-full">
                    <Typography variant="h6" textAlign="center">Feature Goals</Typography>
                    {(project.goals ?? ["Add goals ;)"]).map((g, index) => (
                        <Typography key={index} variant="body1" textAlign="center">{g}</Typography>
                    ))}
                </Paper>
            </Grid>
            <Grid size={6}>
                <Paper elevation={3} className="p-2 h-full">
                    <Typography variant="h6" textAlign="center">Tech Breakdown</Typography>
                    <Typography variant="body1" textAlign="center">{project.technology ?? "All of the technologies."}</Typography>
                </Paper>
            </Grid>
            <Grid size={6}>
                <ProjectTodos todos={project.todo} />
            </Grid>
        </Grid>
    </>);
}