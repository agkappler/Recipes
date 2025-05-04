import { Chip } from "@mui/material"

interface StatusChipProps {
    label: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ label }) => {
    return <Chip label={label} color="primary" variant="outlined" />
}