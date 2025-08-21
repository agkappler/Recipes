import { StyledAccordion } from "../ui/StyledAccordion";
import { AbilityInfo } from "./abilities/AbilityInfo";
import { KnownSpellsDisplay } from "./spells/KnownSpellsDisplay";
import { WeaponInfo } from "./weapons/WeaponInfo";

interface ActionInfoProps {
    characterId: number;
    className: string;
}

export const ActionInfo: React.FC<ActionInfoProps> = ({ characterId, className }) => {
    return (
        <>
            <StyledAccordion title="Weapons">
                <WeaponInfo characterId={characterId} canEdit={false} />
            </StyledAccordion>

            <StyledAccordion title="Abilities">
                <AbilityInfo characterId={characterId} canEdit={false} />
            </StyledAccordion>

            <StyledAccordion title="Spells">
                <KnownSpellsDisplay
                    characterId={characterId}
                    className={className}
                    canEdit={false}
                />
            </StyledAccordion>
        </>
    );
};
