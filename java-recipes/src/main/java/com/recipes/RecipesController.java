package com.recipes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RecipesController {
    private RecipeRepository recipeRepository;

    @Autowired
    public RecipesController(RecipeRepository recipeRepository){
        this.recipeRepository = recipeRepository;
    }

    @GetMapping("/")
    public String Index(){
        return "Greetings from Spring Boot!";
    }

    @GetMapping("/recipe")
    public String Recipe(){
        Recipe recipe = new Recipe();
        recipe.SetName("First One");
        return "{ 'name':'first ONe' }";
    }
    @GetMapping("/recipes")
    public List<Recipe> Recipes() {
        return this.recipeRepository.findAll();
    }
}
