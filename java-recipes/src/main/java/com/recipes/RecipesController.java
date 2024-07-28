package com.recipes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

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

    @GetMapping("/recipes")
    public List<Recipe> Recipes() {
        return this.recipeRepository.findAll();
    }
    
    @GetMapping("/recipes/{id}")
    public Optional<Recipe> Recipe(@PathVariable("id") Long id) {
    	return this.recipeRepository.findById(id);
	}

    @GetMapping("/recipeStrings")
    public String[] RecipeStrings() {
        return new String[] {
            "name: 'Chili'", "name: 'New Chili'", "name: 'Stew'"
        };
    }
}
