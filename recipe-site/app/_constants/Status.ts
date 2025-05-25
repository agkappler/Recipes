
export enum ProjectStatus {
    InProgress = "In Progress",
    Complete = "Completed",
    Concept = "Concept",
}

export enum BountyStatus {
    InProgress = "IN_PROGRESS",
    Overdue = "OVERDUE",
    Complete = "COMPLETE"
}

export const BOUNTY_STATUS_OPTIONS = [
    { value: BountyStatus.InProgress, label: "In Progress" },
    { value: BountyStatus.Complete, label: "Complete" },
    { value: BountyStatus.Overdue, label: "Overdue" }
];

export function getLabelForBountyStatus(status: BountyStatus): string {
    return BOUNTY_STATUS_OPTIONS.find(o => o.value === status)?.label ?? "Unknown";
}