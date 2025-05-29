import { ProjectStatus } from "@/app/_constants/Status";
import { Chip } from "@mui/material"

interface StatusChipProps {
    label: ProjectStatus;
}

export const StatusChip: React.FC<StatusChipProps> = ({ label }) => {
    const getColor = (label: ProjectStatus) => {
        switch (label) {
            case ProjectStatus.Complete:
                return "success";
            case ProjectStatus.Concept:
                return "warning";
            case ProjectStatus.InProgress:
            default:
                return "info";
        }
    }

    return <Chip label={label} color={getColor(label)} variant="outlined" className="w-fit" />
}