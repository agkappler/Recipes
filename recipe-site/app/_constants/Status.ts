import { ChipColor } from "../_components/ui/StatusChip";

export enum ProjectStatus {
    InProgress = "In Progress",
    Complete = "Completed",
    Concept = "Concept",
}

export function getColorForProjectStatus(status: ProjectStatus): ChipColor {
    switch (status) {
        case ProjectStatus.Complete:
            return "success";
        case ProjectStatus.Concept:
            return "warning";
        case ProjectStatus.InProgress:
        default:
            return "info";
    }
}

export enum BountyStatus {
    Active = "ACTIVE",
    Overdue = "OVERDUE",
    Complete = "COMPLETE"
}

export const BOUNTY_STATUS_OPTIONS = [
    { value: BountyStatus.Active, label: "Active" },
    { value: BountyStatus.Complete, label: "Complete" },
    { value: BountyStatus.Overdue, label: "Overdue" }
];

export function getLabelForBountyStatus(status: BountyStatus): string {
    return BOUNTY_STATUS_OPTIONS.find(o => o.value === status)?.label ?? "Unknown";
}

export function getColorForBountyStatus(status: BountyStatus): ChipColor {
    switch (status) {
        case BountyStatus.Complete:
            return "success";
        case BountyStatus.Overdue:
            return "error";
        case BountyStatus.Active:
        default:
            return "info";
    }
}