package com.fargopolis.services;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.fargopolis.models.DndRace;
import com.utils.data.Data;

@Service
public class DndRaceService extends BaseService {

    private static String GET_DND_RACES_SQL = "SELECT * FROM custom_dnd_races ORDER BY name";
    private static String GET_DND_RACE_SQL = "SELECT * FROM custom_dnd_races WHERE race_id = ?";
    private static String INSERT_DND_RACE_SQL = "INSERT INTO custom_dnd_races (name, description) VALUES (?,?) RETURNING race_id";

    public DndRaceService(DataSource dataSource, Data data) {
        super(dataSource, data);
    }

    public List<DndRace> getDndRaces() throws SQLException {
        return this.data.Query(
                GET_DND_RACES_SQL,
                null,
                (ResultSet rs) -> mapDndRace(rs));
    }

    public DndRace getDndRace(Integer raceId) throws SQLException {
        List<DndRace> results = this.data.Query(
                GET_DND_RACE_SQL,
                (PreparedStatement ps) -> ps.setInt(1, raceId),
                (ResultSet rs) -> mapDndRace(rs));

        if (results.size() == 0) {
            throw new SQLException("Failed to load Race with id: " + raceId);
        }

        return results.get(0);
    }

    public DndRace createDndRace(DndRace race) throws SQLException {
        Integer raceId = this.data.InsertWithKey(
                INSERT_DND_RACE_SQL,
                (PreparedStatement ps) -> {
                    ps.setString(1, race.getName());
                    ps.setString(2, race.getDescription());
                });

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
