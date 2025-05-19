export default class Bounty {
    bountyId!: number;
    title: string;
    description: string;
    status: string;
    expirationDate: string;
    cadence: string;

    constructor(bountyId: number, title: string, description: string, status: string, expirationDate: string, cadence: string) {
        this.bountyId = bountyId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.expirationDate = expirationDate;
        this.cadence = cadence;
    }
}