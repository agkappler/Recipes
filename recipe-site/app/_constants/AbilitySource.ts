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

export enum UsageType {
    Action = "ACTION",
    BonusAction = "BONUS_ACTION",
    Reaction = "REACTION",
    FreeAction = "FREE"
}

export const USAGE_TYPE_OPTIONS = [
    { value: UsageType.Action, label: "Action" },
    { value: UsageType.BonusAction, label: "Bonus Action" },
    { value: UsageType.Reaction, label: "Reaction" },
    { value: UsageType.FreeAction, label: "Free Action" },
];

export function getLabelForUsageType(usage: UsageType): string {
    return USAGE_TYPE_OPTIONS.find(o => o.value === usage)?.label ?? "Unknown";
}

export function getColorForUsageType(usage: UsageType): ChipColor {
    switch (usage) {
        case UsageType.Action:
            return "primary";
        case UsageType.BonusAction:
            return "secondary";
        case UsageType.Reaction:
            return "warning";
        case UsageType.FreeAction:
            return "success";
        default:
            return "default";
    }
}