import { ProjectStatus } from "@/app/_constants/Status";
import Bounty from "@/app/_models/Bounty";
import { Paper, Typography } from "@mui/material";
import { StatusChip } from "../ui/StatusChip";

interface BountyCardProps {
    bounty: Bounty;
}

export const BountyCard: React.FC<BountyCardProps> = ({ bounty }) => {
    const getStatus = (status: string) => {
        switch (status) {
            case "COMPLETE":
                return ProjectStatus.Complete;
            case "OVERDUE":
                return ProjectStatus.Concept;
            case "IN_PROGRESS":
            default:
                return ProjectStatus.InProgress;
        }
    }

    return <Paper className="mb-2 mx-2 p-2 flex flex-col" elevation={3}>
        <Typography variant="h6" textAlign="center">{bounty.title}</Typography>
        <StatusChip label={getStatus(bounty.status)} />
        <Typography variant="body1" textAlign="center">{bounty.description}</Typography>
    </Paper>
}