package com.fargopolis.controllers.recipes;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fargopolis.controllers.BaseApiController;
import com.fargopolis.models.RecipeStep;
import com.fargopolis.services.recipes.RecipeStepService;

@RestController
public class RecipeStepsController extends BaseApiController {

	private final RecipeStepService stepService;
	
	@Autowired
	public RecipeStepsController(RecipeStepService stepService) {
		this.stepService = stepService;
	}
	
	@GetMapping("/stepsForRecipe/{recipeId}")
    public ResponseEntity<List<RecipeStep>> GetStepsForRecipe(@PathVariable("recipeId") Integer recipeId) throws Exception {
    	this.permissions.canRead();
    	
		List<RecipeStep> steps = this.stepService.getStepsForRecipe(recipeId);
		return ResponseEntity.ok(steps);
    }
	
	@PostMapping("/updateStepsForRecipe/{recipeId}")
    public ResponseEntity<List<RecipeStep>> UpdateStepsForRecipe(@PathVariable("recipeId") Integer recipeId, @RequestBody List<RecipeStep> steps) throws Exception {
    	this.permissions.canWrite();
    	
//		List<RecipeStep> currentSteps = this.stepService.getStepsForRecipe(recipeId);
		List<RecipeStep> updatedSteps = this.stepService.updateStepsForRecipe(recipeId, steps);
		return ResponseEntity.ok(updatedSteps);
    }
}
