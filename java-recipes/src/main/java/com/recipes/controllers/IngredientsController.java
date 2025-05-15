package com.recipes.controllers;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.recipes.models.Ingredient;
import com.recipes.services.IngredientService;

@RestController
@RequestMapping("/api")
public class IngredientsController {

    private IngredientService ingredientService;

    @Autowired
    public IngredientsController(IngredientService ingredientService){
        this.ingredientService = ingredientService;
    }
    
    @GetMapping("/ingredientsForRecipe/{recipeId}")
    public ResponseEntity<List<Ingredient>> GetIngredientsForRecipe(@PathVariable("recipeId") Integer recipeId) throws Exception {
    	System.out.println("Ingredient for recipe endpoint");
		List<Ingredient> ingredients = this.ingredientService.getIngredientsForRecipe(recipeId);
		return ResponseEntity.ok(ingredients);
    }
    
    @PostMapping("/addIngredientToRecipe/{recipeId}")
    public ResponseEntity<Ingredient> addIngredientToRecipe(@PathVariable("recipeId") Integer recipeId, @RequestBody Ingredient ingredient) throws SQLException {
		System.out.println("Add Ingredient Endpoint");
		this.ingredientService.addIngredientToRecipe(ingredient, recipeId);
    	
    	return ResponseEntity.ok(ingredient);
    }
    
    @PostMapping("/updateIngredient")
    public ResponseEntity<Ingredient> updateIngredient(@RequestBody Ingredient ingredient) throws SQLException {
		System.out.println("Update Ingredient Endpoint");
		this.ingredientService.updateIngredient(ingredient);
    	
    	return ResponseEntity.ok(ingredient);
    }
}
