package com.fargopolis.services.recipes;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.fargopolis.models.Recipe;
import com.fargopolis.services.BaseService;
import com.utils.data.Data;
import com.utils.exceptions.ObjectNotFoundException;

@Service
public class RecipeService extends BaseService {
	
	private final static String GET_RECIPES_SQL = "SELECT * FROM recipes ORDER BY recipe_id";
	private final static String GET_RECIPE_BY_ID_SQL = "SELECT * FROM recipes WHERE recipe_id = ?";
	private final static String INSERT_RECIPE_SQL = "INSERT INTO recipes (name, prep_time_minutes, cook_time_minutes, description, quantity, total_calories) VALUES (?, ?, ?, ?, ?, ?) RETURNING recipe_id";
	private final static String UPDATE_RECIPE_SQL = "UPDATE recipes SET name = ?, prep_time_minutes = ?, cook_time_minutes = ?, description = ?, quantity = ?, total_calories = ? WHERE recipe_id = ?";
	private final static String UPDATE_AVATAR_SQL = "UPDATE recipes SET avatar_id=? WHERE recipe_id = ?";
	
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
	
	public Recipe getRecipe(Integer recipeId) throws SQLException, ObjectNotFoundException {
		List<Recipe> results = this.data.Query(
			GET_RECIPE_BY_ID_SQL,
			(PreparedStatement ps) -> ps.setInt(1, recipeId),
			(ResultSet rs) -> mapRecipe(rs)
		);
		
		if (results.size() == 0) {
			throw new ObjectNotFoundException("Failed to load Recipe with id: " + recipeId);
		}
		
		return results.get(0);
	}
	
	public Integer createRecipe(Recipe recipe) throws SQLException {
		Integer recipeId = this.data.InsertWithKey(
			INSERT_RECIPE_SQL,
			(PreparedStatement ps) -> {
				ps.setString(1, recipe.getName());
				ps.setInt(2, recipe.getPrepTimeMinutes());
				ps.setInt(3, recipe.getCookTimeMinutes());
				ps.setString(4, recipe.getDescription());
				ps.setString(5, recipe.getQuantity());
				ps.setInt(6, recipe.getTotalCalories());
			}
		);
		
		recipe.setRecipeId(recipeId);
		return recipeId;
	}
	
	public void updateRecipe(Recipe recipe) throws SQLException {
		this.data.Execute(
			UPDATE_RECIPE_SQL,
			(PreparedStatement ps) -> {
				ps.setString(1, recipe.getName());
				ps.setInt(2, recipe.getPrepTimeMinutes());
				ps.setInt(3, recipe.getCookTimeMinutes());
				ps.setString(4, recipe.getDescription());
				ps.setString(5, recipe.getQuantity());
				ps.setInt(6, recipe.getTotalCalories());
				ps.setInt(7, recipe.getRecipeId());
			}
		);
	}
	
	public void updateAvatar(Integer recipeId, Integer fileId) throws SQLException {
		this.data.Execute(
			UPDATE_AVATAR_SQL,
			(PreparedStatement ps) -> {
				ps.setInt(1, fileId);
				ps.setInt(2, recipeId);
			}
		);
	}
	
	private Recipe mapRecipe(ResultSet rs) throws SQLException {
		Recipe r = new Recipe();
		r.setRecipeId(rs.getInt("recipe_id"));
		r.setName(rs.getString("name"));
		Integer cookTime = rs.getInt("cook_time_minutes");
		r.setCookTimeMinutes(cookTime != null ? cookTime : -1);
		Integer prepTime = rs.getInt("prep_time_minutes");
		r.setPrepTimeMinutes(prepTime != null ? prepTime : -1);
		r.setDescription(rs.getString("description"));
		r.setQuantity(rs.getString("quantity"));
		r.setAvatarId(rs.getObject("avatar_id") == null ? null : rs.getInt("avatar_id"));
		r.setTotalCalories(rs.getObject("total_calories") == null ? null : rs.getInt("total_calories"));
		return r;
	}
}
