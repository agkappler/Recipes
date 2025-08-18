import { getRelativeUrlInfo, Spell } from "@/app/_api/dnd5eapi";
import useSWR from "swr";
import { LoadingWrapper } from "../../ui/LoadingWrapper";
import { SimpleDialog } from "../../ui/SimpleDialog";
import { DescriptionList } from "../DescriptionList";
import { Button, Box } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import RequestManager from "@/app/_helpers/RequestManager";

interface SpllDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    spell: Spell;
    canLearn: boolean;
    characterId?: number;
    isKnown?: boolean;
    onSpellUpdate?: () => void;
}

export const SpellDetailsModal: React.FC<SpllDetailsModalProps> = ({
    isOpen,
    onClose,
    spell,
    canLearn,
    characterId,
    isKnown = false,
    onSpellUpdate
}) => {
    const { data: spellDetails, isLoading } = useSWR(spell.index, () => getRelativeUrlInfo(spell.url));

    const handleAddSpell = async () => {
        if (characterId && spellDetails) {
            await RequestManager.post(`/character/${characterId}/addKnownSpell`, {
                characterId,
                spellKey: spellDetails.index,
                spellName: spellDetails.name,
                spellLevel: spellDetails.level
            });
            onSpellUpdate?.();
            onClose();
        }
    };

    const handleRemoveSpell = async () => {
        if (characterId && spellDetails) {
            await RequestManager.delete(`/character/${characterId}/deleteKnownSpell?spellKey=${spellDetails.index}`);
            onSpellUpdate?.();
            onClose();
        }
    };

    return <SimpleDialog title={spell.name} isOpen={isOpen} onClose={onClose}>
        <LoadingWrapper isLoading={isLoading} size={10}>
            <DescriptionList descriptions={spellDetails?.desc} />
        </LoadingWrapper>
        {(canLearn || isKnown) && characterId && (
            <Box display="flex" gap={2} marginTop={2}>
                {canLearn && !isKnown && (
                    <Button
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAddSpell}
                    >
                        Add to known spells
                    </Button>
                )}
                {isKnown && (
                    <Button
                        color="error"
                        startIcon={<Remove />}
                        onClick={handleRemoveSpell}
                    >
                        Remove from known spells
                    </Button>
                )}
            </Box>
        )}
    </SimpleDialog>
}