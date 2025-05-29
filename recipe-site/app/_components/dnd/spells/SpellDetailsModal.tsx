import { getRelativeUrlInfo, Spell } from "@/app/api/dnd5eapi";
import { DialogContent, Modal, Paper, Typography } from "@mui/material";
import useSWR from "swr";
import { LoadingWrapper } from "../../ui/LoadingWrapper";
import { DescriptionList } from "../DescriptionList";

interface SpllDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    spell: Spell;
}

export const SpellDetailsModal: React.FC<SpllDetailsModalProps> = ({ isOpen, onClose, spell }) => {
    const { data: spellDetails, isLoading } = useSWR(spell.index, () => getRelativeUrlInfo(spell.url));

    return <Modal open={isOpen} onClose={onClose}>
        <DialogContent>
            <Paper elevation={3} className="p-2">
                <Typography variant="h6" textAlign="center">{spell.name}</Typography>
                <LoadingWrapper isLoading={isLoading} size={10}>
                    <DescriptionList descriptions={spellDetails?.desc} />
                </LoadingWrapper>
            </Paper>
        </DialogContent>
    </Modal>
}