package com.fargopolis.services;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.fargopolis.models.DndCharacter;
import com.utils.data.Data;
import com.utils.exceptions.ObjectNotFoundException;

@Service
public class CharacterService extends BaseService {

	public CharacterService(DataSource dataSource, Data data) {
		super(dataSource, data);
	}
	
	private static String GET_CHARACTERS_SQL = "SELECT * FROM dnd_characters ORDER BY character_id";
	private static String GET_CHARACTER_SQL = "SELECT * FROM dnd_characters WHERE character_id = ?";
	private static String INSERT_CHARACTER_SQL = "INSERT INTO dnd_characters (name, race, subrace, class, subclass, level) VALUES (?,?,?,?,?,?) RETURNING character_id";
	private static String UPDATE_CHARACTER_SQL = "UPDATE dnd_characters SET name=?, race=?, subrace=?, class=?, subclass=?, level=? WHERE character_id = ?";
	private static String UPDATE_AVATAR_SQL = "UPDATE dnd_characters SET avatar_id=? WHERE character_id = ?";
	private static String ADD_RESOURCE_SQL = "INSERT INTO rel_character_resource_file (character_id, file_id) VALUES (?, ?)";
	private static String GET_RESOURCE_FILE_IDS_SQL = "SELECT file_id FROM rel_character_resource_file WHERE character_id = ?";
	
	public List<DndCharacter> getCharacters() throws SQLException {
		return this.data.Query(
			GET_CHARACTERS_SQL,
			null,
			(ResultSet rs) -> mapCharacter(rs)
		);
	}
	
	public DndCharacter getCharacter(Integer characterId) throws SQLException, ObjectNotFoundException {
		List<DndCharacter> results = this.data.Query(
			GET_CHARACTER_SQL,
			(PreparedStatement ps) -> ps.setInt(1, characterId),
			(ResultSet rs) -> mapCharacter(rs)
		);
		
		if (results.size() == 0) {
			throw new ObjectNotFoundException("Failed to load Character with id: " + characterId);
		}
		
		return results.get(0);
	}
	
	public DndCharacter createCharacter(DndCharacter character) throws SQLException {
		Integer characterId =  this.data.InsertWithKey(
			INSERT_CHARACTER_SQL,
			(PreparedStatement ps) -> {
				ps.setString(1, character.getName());
				ps.setString(2, character.getRace());
				ps.setString(3, character.getSubrace());
				ps.setString(4, character.getClassName());
				ps.setString(5, character.getSubclassName());
				ps.setInt(6, character.getLevel());
			}
		);
		
		character.setCharacterId(characterId);
		return character;
	}
	
	public DndCharacter updateCharacter(DndCharacter character) throws SQLException {
		this.data.Execute(
			UPDATE_CHARACTER_SQL,
			(PreparedStatement ps) -> {
				ps.setString(1, character.getName());
				ps.setString(2, character.getRace());
				ps.setString(3, character.getSubrace());
				ps.setString(4, character.getClassName());
				ps.setString(5, character.getSubclassName());
				ps.setInt(6, character.getLevel());
				ps.setInt(7, character.getCharacterId());
			}
		);
		return character;
	}
	
	public void updateAvatar(Integer characterId, Integer fileId) throws SQLException {
		this.data.Execute(
			UPDATE_AVATAR_SQL,
			(PreparedStatement ps) -> {
				ps.setInt(1, fileId);
				ps.setInt(2, characterId);
			}
		);
	}
	
	public void addResource(Integer characterId, Integer fileId) throws SQLException {
		this.data.Execute(
			ADD_RESOURCE_SQL,
			(PreparedStatement ps) -> {
				ps.setInt(1, characterId);
				ps.setInt(2, fileId);
			}
		);
	}
	
	public List<Integer> getResourceFileIds(Integer characterId) throws SQLException {
		return this.data.Query(
			GET_RESOURCE_FILE_IDS_SQL,
			(PreparedStatement ps) -> ps.setInt(1, characterId),
			(ResultSet rs) -> rs.getInt("file_id")
		);
	}
	
	private DndCharacter mapCharacter(ResultSet rs) throws SQLException {
		DndCharacter c = new DndCharacter();
		c.setCharacterId(rs.getInt("character_id"));
		c.setName(rs.getString("name"));
		c.setRace(rs.getString("race"));
		c.setSubrace(rs.getString("subrace"));
		c.setClassName(rs.getString("class"));
		c.setSubclassName(rs.getString("subclass"));
		c.setLevel(rs.getInt("level"));
		c.setAvatarId(rs.getObject("avatar_id") == null ? null : rs.getInt("avatar_id"));
		return c;
	}

}
