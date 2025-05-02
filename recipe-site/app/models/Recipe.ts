
export default class Recipe {
    recipeId: number;
    name: string;
    instructions: string;
    prepTimeMinutes: number;
    cookTimeMinutes: number;

    constructor(
        recipeId: number,
        name: string,
        instructions: string,
        prepTimeMinutes: number,
        cookTimeMinutes: number
    ) {
        this.recipeId = recipeId;
        this.name = name;
        this.instructions = instructions;
        this.prepTimeMinutes = prepTimeMinutes;
        this.cookTimeMinutes = cookTimeMinutes;
    }
}