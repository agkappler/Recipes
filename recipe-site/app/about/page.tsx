import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { GitHubButton } from "../_components/ui/buttons/GitHubButton";
import { LinkedInButton } from "../_components/ui/buttons/LinkedInButton";

export default function About() {
    return <Box className="flex flex-col justify-center align-items-center container mx-auto px-4 py-8">
        <Box borderRadius={64} overflow="hidden" margin="auto">
            <Image src={`/Alex_Kappler_Picture.jpg`} alt={"Alex Kappler"} width="128" height="128" className="m-auto" />
        </Box>
        <Typography variant="h4" component="h1" textAlign="center">Alex Kappler</Typography>
        <Box display="flex" justifyContent="center" gap={2}>
            <LinkedInButton />
            <GitHubButton />
        </Box>
        <Typography variant="body1">
            I began programming in Python as part of Comp Sci 101 at Colgate University and quickly discovered a passion for the problem solving involved in software development. I then continued my coursework with Java and even got into some ARMv8. During my junior year I participated in a winter internship at ScienceLogic where I worked with the Django framework and Javascript and the jQuery library. I went on to graduate with a degree in Computer Science and started a position as a Software Engineer at Alarm.com where I worked as a full stack engineer with Microsoft SQL Server, C#, and the Ember.js framework. I eventually moved on from Alarm.com as a Senior Software Engineer 5 years later to join WealthTeamWork and contribute to an exciting new application using PostgreSQL, Java with Springboot, React, and React Native.
        </Typography>
    </Box>
}