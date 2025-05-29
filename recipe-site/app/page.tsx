import { Box, Link, Typography } from "@mui/material";
import Image from "next/image";
import { ProjectCarousel } from "./_components/home/ProjectCarousel";

export default function Home({
}: {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    return <>
        <Box marginX="auto" marginTop={2} className="w-full">
            <Image src="/logo.png" alt="Fargopolis Logo" width={300} height={150} className="m-auto" />
        </Box>
        <Box textAlign="center">
            <Box sx={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "white",
                padding: "2rem 1rem",
                marginTop: 2
            }}>
                <Typography variant="h4">Welcome!</Typography>
            </Box>
            <Typography variant="body1" marginTop={1} maxWidth="600px" marginX="auto">
                This platform was built as a personal project to explore different technologies, manage my own recipes, gamify recurring tasks as bounties, and organize Dungeons & Dragons characters. It&apos;s also a way to showcase my work and experiment with new ideas. Feel free to explore and see what I&apos;ve been working on!
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
            }}>
                <Typography variant="h5" textAlign="center">Explore My Projects</Typography>
            </Box>
            <ProjectCarousel />
        </Box>
    </>
}