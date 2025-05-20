export default class Bounty {
    bountyId!: number;
    title: string;
    description: string;
    status: string;
    categoryId: number;
    expirationDate: string;

    constructor(bountyId: number, title: string, description: string, status: string, categoryId: number, expirationDate: string) {
        this.bountyId = bountyId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.categoryId = categoryId;
        this.expirationDate = expirationDate;
    }
}