package com.fargopolis.services.recipes;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.fargopolis.models.RecipeStep;
import com.fargopolis.services.BaseService;
import com.utils.data.Data;

@Service
public class RecipeStepService extends BaseService {
	public static String GET_STEPS_FOR_RECIPE_SQL = "SELECT * FROM recipe_steps WHERE recipe_id = ? ORDER BY step_number";
	public static String DELETE_STEPS_FOR_RECIPE_SQL = "DELETE FROM recipe_steps WHERE recipe_id = ?";
	public static String INSERT_STEP_SQL = "INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES (?, ?, ?)";

	
	public RecipeStepService(DataSource dataSource, Data data) {
		super(dataSource, data);
	}
	
	public List<RecipeStep> getStepsForRecipe(Integer recipeId) throws SQLException {
		return this.data.Query(
			GET_STEPS_FOR_RECIPE_SQL,
			(PreparedStatement ps) -> ps.setInt(1, recipeId),
			(ResultSet rs) -> mapRecipeStep(rs)
		);
	}
	
	public List<RecipeStep> updateStepsForRecipe(Integer recipeId, List<RecipeStep> newSteps) throws SQLException {
		this.deleteStepsForRecipe(recipeId);
		return this.insertStepsForRecipe(recipeId, newSteps);
	}
	
	private void deleteStepsForRecipe(Integer recipeId) throws SQLException {
		this.data.Execute(
			DELETE_STEPS_FOR_RECIPE_SQL,
			(PreparedStatement ps) -> ps.setInt(1, recipeId)
		);
	}
	
	private List<RecipeStep> insertStepsForRecipe(Integer recipeId, List<RecipeStep> newSteps) throws SQLException {
		List<Integer> keys = this.data.ExecuteBatch(
				INSERT_STEP_SQL,
				newSteps,
				(PreparedStatement ps, RecipeStep step) -> {
					ps.setInt(1, step.getRecipeId());
					ps.setInt(2, step.getStepNumber());
					ps.setString(3, step.getDescription());
				}
			);
			
			// Set keys on steps.
			for (int i = 0; i < newSteps.size(); i++) {
				newSteps.get(i).setStepId(keys.get(i));
			}
			
			return newSteps;
	}
	
	private RecipeStep mapRecipeStep(ResultSet rs) throws SQLException {
		RecipeStep step = new RecipeStep();
		step.setStepId(rs.getInt("step_id"));
		step.setRecipeId(rs.getInt("recipe_id"));
		step.setStepNumber(rs.getInt("step_number"));
		step.setDescription(rs.getString("description"));
		return step;
	}

}
