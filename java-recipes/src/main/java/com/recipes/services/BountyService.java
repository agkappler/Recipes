package com.recipes.services;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.recipes.enums.BountyCadence;
import com.recipes.enums.BountyStatus;
import com.recipes.models.Bounty;
import com.utils.data.Data;
import com.utils.exceptions.ObjectNotFoundException;

@Service
public class BountyService extends BaseService {
	private static String GET_BOUNTIES_SQL = "SELECT * FROM bounty";
	private static String GET_BOUNTY_SQL = "SELECT * FROM bounty WHERE id = ?";
	private static String INSERT_BOUNTY_SQL = "INSERT INTO bounty (title, description, status, expiration_date, cadence) VALUES (?,?,?,?,?)";
	
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
				// TODO: Expiration date.
				ps.setString(4, null);
				ps.setInt(5, bounty.getCadence().getValue());
			}
		);
		
		bounty.setBountyId(bountyId);
		return bounty;
	}
	
	private Bounty mapBounty(ResultSet rs) throws SQLException {
		Bounty b = new Bounty();
		b.setBountyId(rs.getInt("id"));
		b.setTitle(rs.getString("title"));
		b.setDescription(rs.getString("description"));
		b.setStatus(BountyStatus.getByValue(rs.getInt("status")));
//		b.setExpirationDate(LocalDate.of(rs.getString("expiration_date")));
		b.setCadence(BountyCadence.getByValue(rs.getInt("cadence")));
		return b;
	}
}
