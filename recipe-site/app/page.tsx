import { Box } from "@mui/material";
import { ProjectCards } from "./_components/home/ProjectCards";
import Image from "next/image";

export default function Home({
}: {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    return <>
        <Box marginX="auto" marginTop={2} className="w-full">
            <Image src="/logo.png" alt="Fargopolis Logo" width={300} height={150} className="m-auto" />
        </Box>
        <ProjectCards />
    </>
}