package com.recipes.services;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.recipes.models.DndRace;
import com.utils.data.Data;

@Service
public class DndRaceService extends BaseService {
	
	private static String GET_DND_RACES_SQL = "SELECT * FROM custom_dnd_races ORDER BY name";
//	private static String GET_CHARACTER_SQL = "SELECT * FROM dnd_characters WHERE character_id = ?";
	private static String INSERT_DND_RACE_SQL = "INSERT INTO custom_dnd_races (name, description) VALUES (?,?) RETURNING race_id";
//	private static String UPDATE_CHARACTER_SQL = "UPDATE dnd_characters SET name=?, race=?, subrace=?, class=?, subclass=?, level=? WHERE character_id = ?";
//	private static String UPDATE_AVATAR_SQL = "UPDATE dnd_characters SET avatar_id=? WHERE character_id = ?";

	public DndRaceService(DataSource dataSource, Data data) {
		super(dataSource, data);
	}

	public List<DndRace> getDndRaces() throws SQLException {
		return this.data.Query(
			GET_DND_RACES_SQL,
			null,
			(ResultSet rs) -> mapDndRace(rs)
		);
	}
	
//	public DndCharacter getCharacter(Integer characterId) throws SQLException, ObjectNotFoundException {
//		List<DndCharacter> results = this.data.Query(
//			GET_CHARACTER_SQL,
//			(PreparedStatement ps) -> ps.setInt(1, characterId),
//			(ResultSet rs) -> mapCharacter(rs)
//		);
//		
//		if (results.size() == 0) {
//			throw new ObjectNotFoundException("Failed to load Character with id: " + characterId);
//		}
//		
//		return results.get(0);
//	}
	
	public DndRace createDndRace(DndRace race) throws SQLException {
		Integer raceId =  this.data.InsertWithKey(
			INSERT_DND_RACE_SQL,
			(PreparedStatement ps) -> {
				ps.setString(1, race.getName());
				ps.setString(2, race.getDescription());
			}
		);
		
		race.setRaceId(raceId);
		race.setIndex(race.getName().toLowerCase());
		return race;
	}
	
	private DndRace mapDndRace(ResultSet rs) throws SQLException {
		DndRace race = new DndRace();
		race.setRaceId(rs.getInt("race_id"));
		race.setName(rs.getString("name"));
		race.setIndex(race.getName().toLowerCase());
		race.setDescription(rs.getString("description"));
		return race;
	}
}
