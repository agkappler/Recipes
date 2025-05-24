package com.recipes.services;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.recipes.models.BountyCategory;
import com.utils.data.Data;

@Service
public class BountyCategoryService extends BaseService {
	private static String GET_BOUNTY_CATEGORIES_SQL = "SELECT * FROM bounty_categories ORDER BY name";
	private static String INSERT_BOUNTY_CATEGORY_SQL = "INSERT INTO bounty_categories (name) VALUES (?) RETURNING category_id";
		
	public BountyCategoryService(DataSource dataSource, Data data) {
		super(dataSource, data);
	}
		
	public List<BountyCategory> getBountyCategories() throws SQLException {
		return this.data.Query(
			GET_BOUNTY_CATEGORIES_SQL,
			null,
			(ResultSet rs) -> mapBountyCategory(rs)
		);
	}
	
	public BountyCategory createBountyCategory(BountyCategory bountyCategory) throws SQLException {
		Integer categoryId = this.data.InsertWithKey(
			INSERT_BOUNTY_CATEGORY_SQL,
			(PreparedStatement ps) -> ps.setString(1, bountyCategory.getName())
		);
		
		bountyCategory.setCategoryId(categoryId);
		return bountyCategory;
	}
	
	private BountyCategory mapBountyCategory(ResultSet rs) throws SQLException {
		BountyCategory bc = new BountyCategory();
		bc.setCategoryId(rs.getInt("category_id"));
		bc.setName(rs.getString("name"));
		return bc;
	}
}
