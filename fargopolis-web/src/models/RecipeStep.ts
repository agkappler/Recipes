export default class RecipeStep {
    stepId: number;
    recipeId: number;
    stepNumber: number;
    description: string;

    constructor(
        stepId: number,
        recipeId: number,
        stepNumber: number,
        description: string
    ) {
        this.stepId = stepId;
        this.recipeId = recipeId;
        this.stepNumber = stepNumber;
        this.description = description;
    }

}