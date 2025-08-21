import { ChipColor } from "../_components/ui/StatusChip";

export enum AbilitySource {
    Class = "CLASS",
    Race = "RACE",
    Feat = "FEAT",
    Other = "OTHER"
}

export const ABILITY_SOURCE_OPTIONS = [
    { value: AbilitySource.Class, label: "Class" },
    { value: AbilitySource.Race, label: "Race" },
    { value: AbilitySource.Feat, label: "Feat" },
    { value: AbilitySource.Other, label: "Other" }
];

export function getLabelForAbilitySource(source: AbilitySource): string {
    return ABILITY_SOURCE_OPTIONS.find(o => o.value === source)?.label ?? "Unknown";
}

export function getColorForAbilitySource(source: AbilitySource): ChipColor {
    switch (source) {
        case AbilitySource.Class:
            return "primary";
        case AbilitySource.Race:
            return "secondary";
        case AbilitySource.Feat:
            return "warning";
        case AbilitySource.Other:
        default:
            return "default";
    }
}