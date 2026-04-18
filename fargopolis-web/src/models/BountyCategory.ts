export default class BountyCategory {
    categoryId: number;
    name: string;

    constructor(categoryId: number, name: string) {
        this.categoryId = categoryId;
        this.name = name;
    }
}