
export default class Recipe {
    recipeId: number;
    name: string;
    description: string;
    quantity: string;
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    totalCalories: number;
    avatarId: number | undefined;

    constructor(
        recipeId: number,
        name: string,
        description: string,
        quantity: string,
        prepTimeMinutes: number,
        cookTimeMinutes: number,
        totalCalories: number
    ) {
        this.recipeId = recipeId;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.prepTimeMinutes = prepTimeMinutes;
        this.cookTimeMinutes = cookTimeMinutes;
        this.totalCalories = totalCalories;
    }
}