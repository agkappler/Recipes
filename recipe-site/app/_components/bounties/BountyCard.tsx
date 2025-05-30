import { ProjectStatus } from "@/app/_constants/Status";
import Bounty from "@/app/_models/Bounty";
import { Typography } from "@mui/material";
import { ModelCard } from "../ui/ModelCard";
import { StatusChip } from "../ui/StatusChip";

interface BountyCardProps {
    bounty: Bounty;
    onClick: () => void;
}

export const BountyCard: React.FC<BountyCardProps> = ({ bounty, onClick }) => {
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

    return <ModelCard title={bounty.title} onClick={onClick}>
        <StatusChip label={getStatus(bounty.status)} />
        <Typography variant="body1">{bounty.description}</Typography>
    </ModelCard>
}