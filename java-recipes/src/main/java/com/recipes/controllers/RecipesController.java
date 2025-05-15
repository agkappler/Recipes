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

import com.recipes.models.Recipe;
import com.recipes.services.RecipeService;
//import com.repositories.RecipeRepository;

@RestController
@RequestMapping("/api")
public class RecipesController {
//    private RecipeRepository recipeRepository;
    private RecipeService recipeService;

    @Autowired
    public RecipesController(RecipeService recipeService){
//        this.recipeRepository = recipeRepository;
        this.recipeService = recipeService;
    }

    @GetMapping("/")
    public String Index(){
        return "Greetings from Spring Boot!";
    }

    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<Recipe> Recipe(@PathVariable("recipeId") Integer recipeId) throws Exception {
    	System.out.println("Recipe Endpoint id: " + recipeId);
		Recipe recipe = this.recipeService.getRecipe(recipeId);
		return ResponseEntity.ok(recipe);
    }
    
    @GetMapping("/recipes")
    public ResponseEntity<List<Recipe>> Recipes() throws SQLException {
		System.out.println("Recipes Endpoint");
		List<Recipe> recipes = this.recipeService.getRecipes();
    	
    	return ResponseEntity.ok(recipes);
    }
    
    @PostMapping("/createRecipe")
    public ResponseEntity<Recipe> createRecipe(@RequestBody Recipe recipe) throws SQLException {
		System.out.println("Create Recipe Endpoint");
		this.recipeService.createRecipe(recipe);
    	
    	return ResponseEntity.ok(recipe);
    }
    
    @PostMapping("/updateRecipe")
    public ResponseEntity<Recipe> updateRecipe(@RequestBody Recipe recipe) throws SQLException {
		System.out.println("Update Recipe Endpoint");
		this.recipeService.updateRecipe(recipe);
    	
    	return ResponseEntity.ok(recipe);
    }
}
