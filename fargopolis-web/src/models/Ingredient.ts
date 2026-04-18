export default class Ingredient {
    ingredientId: number;
    name: string;
    quantity: string;
    calories: number;

    constructor(
        ingredientId: number,
        name: string,
        quantity: string,
        calories: number
    ) {
        this.ingredientId = ingredientId;
        this.name = name;
        this.quantity = quantity;
        this.calories = calories;
    }

}