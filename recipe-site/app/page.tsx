import { Box, Link, Typography } from "@mui/material";
import Image from "next/image";
import { ProjectHeader } from "./_components/home/ProjectHeader";
import { Carousel } from "./_components/ui/Carousel";
import { StatusChip } from "./_components/ui/StatusChip";
import { LinkButton } from "./_components/ui/buttons/LinkButton";
import { MOBILE_BREAK } from "./_constants/Media";
import { FARGOPOLIS_BLURB, PROJECTS } from "./_constants/Projects";

export default function Home({
}: {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    return <>
        <Box textAlign="center">
            <Box sx={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "white",
                padding: "2rem 1rem",
                marginTop: 2
            }}>
                <Typography variant="h4">Welcome!</Typography>
            </Box>
            <Box marginX="auto" marginTop={2} className="w-full">
                <Image src="/logo.png" alt="Fargopolis Logo" width={300} height={150} className="m-auto" />
            </Box>
            <Typography variant="body1" marginTop={1} maxWidth={MOBILE_BREAK} marginX="auto" padding={1}>
                {FARGOPOLIS_BLURB}
            </Typography>
            <Typography variant="body1" marginTop={1} marginX="auto">
                You can find out more about me <Link href="/about" color="inherit">here</Link>.
            </Typography>
        </Box>

        <Box marginTop={2}>
            <Box sx={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "white",
                padding: "2rem 1rem",
                marginBottom: 4
            }}>
                <Typography variant="h5" textAlign="center">Explore My Projects</Typography>
            </Box>
            {/* <ProjectCarousel /> */}
            <Carousel
                cardContents={PROJECTS.map((project, index) => (<>
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
                </>))}

            />
        </Box>
    </>
}