import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Typography } from '@mui/material';
import Image from 'next/image';

export const MyTimeline: React.FC = () => {
    return (
        <Timeline position="alternate" sx={{ marginTop: 3 }}>
            <TimelineItem sx={{ "::before": { display: "none" } }}>
                <TimelineOppositeContent display="flex" flexDirection="row-reverse" gap={2} color="text.secondary">
                    <Typography variant="body1">2015</Typography>
                    <Image src="/colgate_c.png" alt="Colgate C" width={100} height={100} style={{ transform: "translateY(-35%)" }} />
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    Enroll at Colgate University as an intended Math or Molecular Biology major.
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineOppositeContent display="flex" gap={2} color="text.secondary">
                    <Typography variant="body1">2018</Typography>
                    <Image src="/sciencelogic_logo.png" alt="Alarm.com Logo" width={200} height={100} style={{ transform: "translateY(-35%)" }} />
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>Participate in a winter internship at ScienceLogic before studying abroad.</TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineOppositeContent display="flex" flexDirection="row-reverse" gap={2} color="text.secondary">
                    <Typography variant="body1">2019</Typography>
                    <Image src="/colgate_crest.png" alt="Colgate Crest" width={100} height={100} style={{ transform: "translateY(-35%)" }} />
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    Graduate from Colgate University with a degree in Computer Science.
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineOppositeContent display="flex" gap={2} color="text.secondary">
                    <Typography variant="body1">2019</Typography>
                    <Image src="/alarm_logo.png" alt="Alarm.com Logo" width={100} height={50} style={{ transform: "translateY(-35%)" }} />
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent marginBottom={3}>Start work at Alarm.com as a Software Engineer.</TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineOppositeContent display="flex" flexDirection="row-reverse" gap={2} color="text.secondary">
                    <Typography variant="body1">2024</Typography>
                    <Image src="/wealthteamwork_logo.jpeg" alt="WealtTeamWork Logo" width={100} height={100} style={{ transform: "translateY(-35%)" }} />
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>Join WealthTeamWork as a Senior Software Engineer.</TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineOppositeContent display="flex" gap={2} color="text.secondary">
                    <Typography variant="body1">2025</Typography>
                    <Image src="/logo.png" alt="Fargopolis Logo" width={200} height={100} style={{ transform: "translateY(-35%)" }} />
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot />
                </TimelineSeparator>
                <TimelineContent>Deploy fargopolis.com as a public website to showcase my hobby projects.</TimelineContent>
            </TimelineItem>
        </Timeline>
    );
}