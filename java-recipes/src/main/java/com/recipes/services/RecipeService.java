package com.recipes.services;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.recipes.Recipe;
import com.utils.Data;

@Service
public class RecipeService extends BaseService {
	
	private final static String GET_RECIPES_SQL = "SELECT * FROM Recipe";
	private final static String GET_RECIPE_BY_ID_SQL = "SELECT * FROM Recipe WHERE id = ?";
	private final static String INSERT_RECIPE_SQL = "INSERT INTO RECIPE (name, prepTimeMinutes, cookTimeMinutes, instructions) VALUES (?, ?, ?, ?)";
	private final static String UPDATE_RECIPE_SQL = "UPDATE RECIPE SET name = ?, prepTimeMinutes = ?, cookTimeMinutes = ?, instructions = ? WHERE id = ?";

	public RecipeService(DataSource dataSource, Data data) {
		super(dataSource, data);
	}
	
	public List<Recipe> getRecipes() throws SQLException {
		return this.data.Query(
			GET_RECIPES_SQL,
			(PreparedStatement ps) -> {},
			(ResultSet rs) -> mapRecipe(rs)
		);
	}
	
	public Recipe getRecipe(Integer recipeId) throws SQLException {
		List<Recipe> results = this.data.Query(
			GET_RECIPE_BY_ID_SQL,
			(PreparedStatement ps) -> ps.setInt(1, recipeId),
			(ResultSet rs) -> mapRecipe(rs)
		);
		return results.size() == 0 ? new Recipe() : results.get(0);
	}
	
	public Integer createRecipe(Recipe recipe) throws SQLException {
		Integer recipeId = this.data.InsertWithKey(
			INSERT_RECIPE_SQL,
			(PreparedStatement ps) -> {
				ps.setString(1, recipe.getName());
				ps.setInt(2, recipe.getPrepTimeMinutes());
				ps.setInt(3, recipe.getCookTimeMinutes());
				ps.setString(4, recipe.getInstructions());
			}
		);
		
		recipe.setRecipeId(recipeId);
		return recipeId;
	}
	
	public void updateRecipe(Recipe recipe) throws SQLException {
		this.data.InsertWithKey(
			UPDATE_RECIPE_SQL,
			(PreparedStatement ps) -> {
				ps.setString(1, recipe.getName());
				ps.setInt(2, recipe.getPrepTimeMinutes());
				ps.setInt(3, recipe.getCookTimeMinutes());
				ps.setString(4, recipe.getInstructions());
				ps.setInt(5, recipe.getRecipeId());
			}
		);
	}
	
	private Recipe mapRecipe(ResultSet rs) throws SQLException {
		Recipe r = new Recipe();
		r.setRecipeId(rs.getInt("id"));
		r.setName(rs.getString("name"));
		r.setRecipeId(rs.getInt("id"));
		Integer cookTime = rs.getInt("cookTimeMinutes");
		r.setCookTimeMinutes(cookTime != null ? cookTime : -1);
		Integer prepTime = rs.getInt("prepTimeMinutes");
		r.setPrepTimeMinutes(prepTime != null ? prepTime : -1);
		String instructions = rs.getString("instructions");
		r.setInstructions(instructions != null ? instructions : "No instructions yet!");
		return r;
	}
}
