package com.recipes.services;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.recipes.enums.BountyStatus;
import com.recipes.models.Bounty;
import com.utils.data.Data;
import com.utils.exceptions.ObjectNotFoundException;

@Service
public class BountyService extends BaseService {
	private static String GET_BOUNTIES_SQL = "SELECT * FROM bounties ORDER BY bounty_id";
	private static String GET_BOUNTY_SQL = "SELECT * FROM bounties WHERE bounty_id = ?";
	private static String INSERT_BOUNTY_SQL = "INSERT INTO bounties (title, description, status, category_id, expiration_date) VALUES (?,?,?,?,?) RETURNING bounty_id";
	private static String UPDATE_BOUNTY_SQL = "UPDATE bounties SET title=?, description=?, status=?, category_id=?, expiration_date=? WHERE bounty_id = ?";
	
	public BountyService(DataSource dataSource, Data data) {
		super(dataSource, data);
	}
	
	public List<Bounty> getBounties() throws SQLException {
		return this.data.Query(
			GET_BOUNTIES_SQL,
			null,
			(ResultSet rs) -> mapBounty(rs)
		);
	}
	
	public Bounty getBounty(Integer bountyId) throws SQLException, ObjectNotFoundException {
		List<Bounty> results = this.data.Query(
			GET_BOUNTY_SQL,
			(PreparedStatement ps) -> ps.setInt(1, bountyId),
			(ResultSet rs) -> mapBounty(rs)
		);
		
		if (results.size() == 0) {
			throw new ObjectNotFoundException("Failed to load Bounty with id: " + bountyId);
		}
		
		return results.get(0);
	}
	
	public Bounty createBounty(Bounty bounty) throws SQLException {
		Integer bountyId =  this.data.InsertWithKey(
			INSERT_BOUNTY_SQL,
			(PreparedStatement ps) -> {
				ps.setString(1, bounty.getTitle());
				ps.setString(2, bounty.getDescription());
				ps.setInt(3, bounty.getStatus().getValue());
				ps.setInt(4, bounty.getCategoryId());
				// TODO: Expiration date.
				ps.setDate(5, null);
			}
		);
		
		bounty.setBountyId(bountyId);
		return bounty;
	}
	
	public Bounty updateBounty(Bounty bounty) throws SQLException {
		this.data.Execute(
			UPDATE_BOUNTY_SQL,
			(PreparedStatement ps) -> {
				ps.setString(1, bounty.getTitle());
				ps.setString(2, bounty.getDescription());
				ps.setInt(3, bounty.getStatus().getValue());
				ps.setInt(4, bounty.getCategoryId());
				// TODO: Expiration date.
				ps.setDate(5, null);
				ps.setInt(6, bounty.getBountyId());
			}
		);
		return bounty;
	}
	
	private Bounty mapBounty(ResultSet rs) throws SQLException {
		Bounty b = new Bounty();
		b.setBountyId(rs.getInt("bounty_id"));
		b.setTitle(rs.getString("title"));
		b.setDescription(rs.getString("description"));
		b.setStatus(BountyStatus.getByValue(rs.getInt("status")));
		b.setCategoryId(rs.getInt("category_id"));
//		b.setExpirationDate(LocalDate.of(rs.getString("expiration_date")));
		return b;
	}
}
