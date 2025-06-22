package com.recipes.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Recipe {
    private Integer recipeId;
    private String name;
    private String instructions;
    private Integer prepTimeMinutes;
    private Integer cookTimeMinutes;
    private Integer totalCalories;
    private String quantity;
    private Integer avatarId;

    @Override
    public String toString() {
        return "Recipe{" +
                "recipeId=" + recipeId +
                ", name='" + name +
                '}';
    }
}
