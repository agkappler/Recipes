package com.fargopolis.services.recipes;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.fargopolis.models.Ingredient;
import com.fargopolis.services.BaseService;
import com.utils.data.Data;

@Service
public class IngredientService extends BaseService {
	
	public static String GET_INGREDIENTS_BY_RECIPE_SQL = """
			SELECT i.*
			FROM ingredients i
			INNER JOIN rel_recipe_ingredient rri ON i.ingredient_id = rri.ingredient_id
			WHERE rri.recipe_id = ?
			ORDER BY ingredient_id
			""";
	public static String INSERT_INGREDIENT_SQL = "INSERT INTO ingredients (name, quantity, calories) VALUES (?,?,?) RETURNING ingredient_id";
	public static String INSERT_REL_RECIPE_INGREDIENT_SQL = "INSERT INTO rel_recipe_ingredient (recipe_id, ingredient_id) VALUES (?,?)";
	public static String UPDATE_INGREDIENT_SQL = "UPDATE ingredients SET name = ?, quantity = ?, calories = ? WHERE ingredient_id = ?";
	
	public IngredientService(DataSource dataSource, Data data) {
		super(dataSource, data);
	}
	
	public List<Ingredient> getIngredientsForRecipe(Integer recipeId) throws SQLException {
		return this.data.Query(
			GET_INGREDIENTS_BY_RECIPE_SQL,
			(PreparedStatement ps) -> ps.setInt(1, recipeId),
			(ResultSet rs) -> mapIngredient(rs)
		);
	}
	
	public Integer addIngredientToRecipe(Ingredient ingredient, Integer recipeId) throws SQLException {
		Integer ingredientId = this.data.InsertWithKey(
			INSERT_INGREDIENT_SQL,
			(PreparedStatement ps) -> {
				ps.setString(1, ingredient.getName());
				ps.setString(2, ingredient.getQuantity());
				ps.setInt(3, ingredient.getCalories());
			}
		);
		
		ingredient.setIngredientId(ingredientId);
		
		// TODO: If this fails we end up w/o a mapping to the new ingredient.
		this.data.Execute(
			INSERT_REL_RECIPE_INGREDIENT_SQL,
			(PreparedStatement ps) -> {
				ps.setInt(1, recipeId);
				ps.setInt(2, ingredientId);
			}
		);
		
		return ingredientId;
	}
	
	public void updateIngredient(Ingredient ingredient) throws SQLException {
		this.data.Execute(
			UPDATE_INGREDIENT_SQL,
			(PreparedStatement ps) -> {
				ps.setString(1, ingredient.getName());
				ps.setString(2, ingredient.getQuantity());
				ps.setInt(3, ingredient.getCalories());
				ps.setInt(4, ingredient.getIngredientId());
			}
		);
	}
	
	private Ingredient mapIngredient(ResultSet rs) throws SQLException {
		Ingredient i = new Ingredient();
		i.setIngredientId(rs.getInt("ingredient_id"));
		i.setName(rs.getString("name"));
		i.setQuantity(rs.getString("quantity"));
		i.setCalories(rs.getInt("calories"));
		return i;
	}
}
