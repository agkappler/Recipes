
export default class Recipe {
    recipeId: number;
    name: string;
    instructions: string;
    quantity: string;
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    totalCalories: number;
    avatarId: number | undefined;

    constructor(
        recipeId: number,
        name: string,
        instructions: string,
        quantity: string,
        prepTimeMinutes: number,
        cookTimeMinutes: number,
        totalCalories: number
    ) {
        this.recipeId = recipeId;
        this.name = name;
        this.instructions = instructions;
        this.quantity = quantity;
        this.prepTimeMinutes = prepTimeMinutes;
        this.cookTimeMinutes = cookTimeMinutes;
        this.totalCalories = totalCalories;
    }
}