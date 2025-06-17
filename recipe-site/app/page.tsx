import { Box, Link, Typography } from "@mui/material";
import Image from "next/image";
import { ProjectCardContents } from "./_components/home/ProjectCardContents";
import { Carousel } from "./_components/ui/Carousel";
import { LinkButton } from "./_components/ui/buttons/LinkButton";
import { MOBILE_BREAK } from "./_constants/Media";
import { FARGOPOLIS_BLURB, PROJECTS } from "./_constants/Projects";

export default function Home(
    //     {
    // }: {
    //     params: { id: string };
    //     searchParams: { [key: string]: string | string[] | undefined };
    // }
) {
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
            <Carousel
                cardContents={PROJECTS.map((project, index) => (
                    <ProjectCardContents project={project} index={index} key={index} />
                ))}
            />
            <Box justifyContent="center" display="flex" marginTop={2}>
                <LinkButton url="/projects" label="View All Projects" />
            </Box>
        </Box>
    </>
}