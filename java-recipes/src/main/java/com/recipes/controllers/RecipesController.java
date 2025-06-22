package com.recipes.controllers;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.recipes.dto.ImageUrl;
import com.recipes.models.Recipe;
import com.recipes.services.FileService;
import com.recipes.services.RecipeService;

@RestController
public class RecipesController extends BaseApiController {
    private final RecipeService recipeService;
    private final FileService fileService;

    @Autowired
    public RecipesController(RecipeService recipeService, FileService fileService){
        this.recipeService = recipeService;
        this.fileService = fileService;
    }

    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<Recipe> Recipe(@PathVariable("recipeId") Integer recipeId) throws Exception {
    	this.permissions.canRead();
    	
		Recipe recipe = this.recipeService.getRecipe(recipeId);
		return ResponseEntity.ok(recipe);
    }
    
    @GetMapping("/recipes")
    public ResponseEntity<List<Recipe>> Recipes() throws SQLException {
		this.permissions.canRead();
		
		List<Recipe> recipes = this.recipeService.getRecipes();
    	return ResponseEntity.ok(recipes);
    }
    
    @PostMapping("/createRecipe")
    public ResponseEntity<Recipe> createRecipe(@RequestBody Recipe recipe) throws SQLException {
		this.permissions.canWrite();
		
		this.recipeService.createRecipe(recipe);
    	return ResponseEntity.ok(recipe);
    }
    
    @PostMapping("/updateRecipe")
    public ResponseEntity<Recipe> updateRecipe(@RequestBody Recipe recipe) throws SQLException {
		this.permissions.canWrite();
		
		this.recipeService.updateRecipe(recipe);
    	return ResponseEntity.ok(recipe);
    }
    
    @PostMapping("/updateRecipeAvatar")
    public ResponseEntity<ImageUrl> updateRecipeAvatar(
    		@RequestParam("recipeId") Integer recipeId,
    		@RequestParam("fileId") Integer fileId
	) throws Exception {
		this.permissions.canWrite();
		
		recipeService.updateAvatar(recipeId, fileId);
		String avatarUrl = fileService.getUrlForFileById(fileId);
		
    	return ResponseEntity.ok(new ImageUrl(avatarUrl));
    }
}
