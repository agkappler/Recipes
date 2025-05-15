export default class Bounty {
    bountyId!: number;
    title: string;
    description: string;
    status: number;
    expirationDate: string;
    cadence: number;

    constructor(bountyId: number, title: string, description: string, status: number, expirationDate: string, cadence: number) {
        this.bountyId = bountyId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.expirationDate = expirationDate;
        this.cadence = cadence;
    }
}