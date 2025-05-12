package com.recipes;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Ingredient {
	public Integer ingredientId;
	public String name;
	public String quantity;
	public Integer calories;
}
