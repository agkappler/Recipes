import { LinkedIn } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import Image from "next/image";

export default function About() {
    return <Box className="flex flex-col justify-center align-items-center container mx-auto px-4 py-8">
        <Image src={`/Alex_Kappler_Picture.jpg`} alt={"Alex Kappler"} width="128" height="128" className="m-auto" />
        <Typography variant="h4" component="h1" textAlign="center">Alex Kappler</Typography>
        <Box display="flex" justifyContent="center">
            <IconButton
                href="https://www.linkedin.com/in/alex-kappler-952749140/"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
            >
                <LinkedIn />
            </IconButton>
        </Box>
    </Box>
}