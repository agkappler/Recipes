import { getRelativeUrlInfo, Spell } from "@/app/api/dnd5eapi";
import useSWR from "swr";
import { LoadingWrapper } from "../../ui/LoadingWrapper";
import { SimpleDialog } from "../../ui/SimpleDialog";
import { DescriptionList } from "../DescriptionList";

interface SpllDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    spell: Spell;
}

export const SpellDetailsModal: React.FC<SpllDetailsModalProps> = ({ isOpen, onClose, spell }) => {
    const { data: spellDetails, isLoading } = useSWR(spell.index, () => getRelativeUrlInfo(spell.url));

    return <SimpleDialog title={spell.name} isOpen={isOpen} onClose={onClose}>
        <LoadingWrapper isLoading={isLoading} size={10}>
            <DescriptionList descriptions={spellDetails?.desc} />
        </LoadingWrapper>
    </SimpleDialog>
}