package com.fargopolis.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RecipeStep {
	private Integer stepId;
	private Integer recipeId;
	private Integer stepNumber;
	private String description;
}
