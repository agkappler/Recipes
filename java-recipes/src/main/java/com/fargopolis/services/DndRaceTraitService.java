package com.fargopolis.services;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.fargopolis.models.DndRaceTrait;
import com.utils.data.Data;

@Service
public class DndRaceTraitService extends BaseService {
    private static final String GET_TRAITS_FOR_RACE_SQL = "SELECT rt.race_trait_id, rt.name, rt.description " +
            "FROM dnd_race_traits rt " +
            "JOIN rel_dnd_race_traits rrt ON rt.race_trait_id = rrt.race_trait_id " +
            "WHERE rrt.race_id = ? " +
            "ORDER BY rt.name";

    private static final String DELETE_TRAITS_FOR_RACE_SQL = "DELETE FROM rel_dnd_race_traits WHERE race_id = ?";

    private static final String INSERT_TRAIT_SQL = "INSERT INTO dnd_race_traits (name, description) VALUES (?, ?) RETURNING race_trait_id";

    private static final String INSERT_RACE_TRAIT_RELATION_SQL = "INSERT INTO rel_dnd_race_traits (race_id, race_trait_id) VALUES (?, ?)";

    public DndRaceTraitService(DataSource dataSource, Data data) {
        super(dataSource, data);
    }

    public List<DndRaceTrait> getTraitsForRace(Integer raceId) throws SQLException {
        return this.data.Query(
                GET_TRAITS_FOR_RACE_SQL,
                (PreparedStatement ps) -> ps.setInt(1, raceId),
                (ResultSet rs) -> mapRaceTrait(rs));
    }

    public List<DndRaceTrait> updateTraitsForRace(Integer raceId, List<DndRaceTrait> newTraits) throws SQLException {
        this.deleteTraitsForRace(raceId);
        return this.insertTraitsForRace(raceId, newTraits);
    }

    private void deleteTraitsForRace(Integer raceId) throws SQLException {
        this.data.Execute(
                DELETE_TRAITS_FOR_RACE_SQL,
                (PreparedStatement ps) -> ps.setInt(1, raceId));
    }

    private List<DndRaceTrait> insertTraitsForRace(Integer raceId, List<DndRaceTrait> newTraits) throws SQLException {
        for (DndRaceTrait trait : newTraits) {
            // Insert the trait
            Integer traitId = this.data.InsertWithKey(
                    INSERT_TRAIT_SQL,
                    (PreparedStatement ps) -> {
                        ps.setString(1, trait.getName());
                        ps.setString(2, trait.getDescription());
                    });

            // Set the trait ID
            trait.setRaceTraitId(traitId);

            // Create the relationship
            this.data.Execute(
                    INSERT_RACE_TRAIT_RELATION_SQL,
                    (PreparedStatement ps) -> {
                        ps.setInt(1, raceId);
                        ps.setInt(2, traitId);
                    });
        }

        return newTraits;
    }

    private DndRaceTrait mapRaceTrait(ResultSet rs) throws SQLException {
        DndRaceTrait trait = new DndRaceTrait();
        trait.setRaceTraitId(rs.getInt("race_trait_id"));
        trait.setName(rs.getString("name"));
        trait.setDescription(rs.getString("description"));
        return trait;
    }
}
