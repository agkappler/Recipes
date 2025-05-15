import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Button } from "@mui/material";

interface LinkButtonProps {
    url: string;
    label: string;
    isForward?: boolean;
}

export const LinkButton: React.FC<LinkButtonProps> = ({ url, label, isForward = true }) => {
    return <Button variant="text" startIcon={isForward ? undefined : <ChevronLeft />} endIcon={isForward ? <ChevronRight /> : undefined} href={url}>
        {label}
    </Button>;
}