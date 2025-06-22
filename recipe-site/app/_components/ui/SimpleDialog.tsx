import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { PropsWithChildren } from "react";


interface SimpleDialogProps extends PropsWithChildren {
    title: string;
    isOpen: boolean;
    onClose: () => void;
}

export const SimpleDialog: React.FC<SimpleDialogProps> = ({ title, isOpen, onClose, children }) => {
    return <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle textAlign="center" variant="h4">{title}</DialogTitle>
        <DialogContent>
            {children}
        </DialogContent>
    </Dialog>
}