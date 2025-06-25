import { getColorForBountyStatus, getLabelForBountyStatus } from "@/app/_constants/Status";
import Bounty from "@/app/_models/Bounty";
import { Box, Chip, Typography } from "@mui/material";
import { ModelCard } from "../ui/ModelCard";
import { StatusChip } from "../ui/StatusChip";
import BountyCategory from "@/app/_models/BountyCategory";

interface BountyCardProps {
    bounty: Bounty;
    onClick: () => void;
    category: BountyCategory | undefined;
}

export const BountyCard: React.FC<BountyCardProps> = ({ bounty, onClick, category }) => {
    return <ModelCard title={bounty.title} onClick={onClick}>
        <Box display="flex" justifyContent="space-between" gap={2}>
            <StatusChip label={getLabelForBountyStatus(bounty.status)} color={getColorForBountyStatus(bounty.status)} />
            <Chip label={category?.name ?? "Unknown"} />
        </Box>
        <Typography variant="body1">{bounty.description}</Typography>
    </ModelCard>
}