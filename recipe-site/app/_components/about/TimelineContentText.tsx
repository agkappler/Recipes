import TimelineContent from "@mui/lab/TimelineContent"
import { Typography } from "@mui/material"

interface TimelineContentTextProps {
    title: string;
    content: string;
}

export const TimelineContentText: React.FC<TimelineContentTextProps> = ({ title, content }) => {
    return <TimelineContent style={{ transform: "translateY(-35%)" }}>
        <Typography variant="subtitle1" textAlign="center">{title}</Typography>
        <Typography variant="body2" textAlign="center" marginBottom={2}>
            {content}
        </Typography>
    </TimelineContent>
}