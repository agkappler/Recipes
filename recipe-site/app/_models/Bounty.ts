import { BountyStatus } from "../_constants/Status";

export default class Bounty {
    bountyId!: number;
    title: string;
    description: string;
    status: BountyStatus;
    categoryId: number;
    expirationDate: string;

    constructor(bountyId: number, title: string, description: string, status: BountyStatus, categoryId: number, expirationDate: string) {
        this.bountyId = bountyId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.categoryId = categoryId;
        this.expirationDate = expirationDate;
    }
}