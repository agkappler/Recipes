package com.fargopolis.services.dnd;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.fargopolis.models.Ability;
import com.fargopolis.enums.AbilitySource;
import com.fargopolis.enums.UsageType;
import com.fargopolis.services.BaseService;
import com.utils.data.Data;

@Service
public class AbilityService extends BaseService {

    private static final String GET_ABILITIES_SQL = "SELECT * FROM abilities WHERE character_id = ? ORDER BY name";
    private static final String GET_ABILITY_BY_ID_SQL = "SELECT * FROM abilities WHERE ability_id = ?";
    private static final String INSERT_ABILITY_SQL = "INSERT INTO abilities (character_id, name, description, source, source_description, recovery, usage) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING ability_id";
    private static final String UPDATE_ABILITY_SQL = "UPDATE abilities SET name = ?, description = ?, source = ?, source_description = ?, recovery = ?, usage = ? WHERE ability_id = ?";
    private static final String DELETE_ABILITY_SQL = "DELETE FROM abilities WHERE ability_id = ?";

    public AbilityService(DataSource dataSource, Data data) {
        super(dataSource, data);
    }

    public List<Ability> getAbilities(Integer characterId) throws SQLException {
        List<Ability> abilities = this.data.Query(
                GET_ABILITIES_SQL,
                (PreparedStatement ps) -> ps.setInt(1, characterId),
                (ResultSet rs) -> mapAbility(rs));
        return abilities;
    }

    public Ability getAbilityById(Integer abilityId) throws SQLException {
        List<Ability> abilities = this.data.Query(
                GET_ABILITY_BY_ID_SQL,
                (PreparedStatement ps) -> ps.setInt(1, abilityId),
                (ResultSet rs) -> mapAbility(rs));

        if (abilities.isEmpty()) {
            throw new IllegalArgumentException("Ability not found with ID: " + abilityId);
        }

        return abilities.get(0);
    }

    public Ability addAbility(Ability ability) throws SQLException {
        Integer abilityId = this.data.InsertWithKey(
                INSERT_ABILITY_SQL,
                (PreparedStatement ps) -> {
                    ps.setInt(1, ability.getCharacterId());
                    ps.setString(2, ability.getName());
                    ps.setString(3, ability.getDescription());
                    ps.setInt(4, ability.getSource() != null ? ability.getSource().getValue() : null);
                    ps.setString(5, ability.getSourceDescription());
                    ps.setString(6, ability.getRecovery());
                    ps.setInt(7, ability.getUsage() != null ? ability.getUsage().getValue() : null);
                });
        ability.setAbilityId(abilityId);
        return ability;
    }

    public Ability updateAbility(Ability ability) throws SQLException {
        // First verify the ability exists
        getAbilityById(ability.getAbilityId());

        // Update the ability
        this.data.Execute(
                UPDATE_ABILITY_SQL,
                (PreparedStatement ps) -> {
                    ps.setString(1, ability.getName());
                    ps.setString(2, ability.getDescription());
                    ps.setInt(3, ability.getSource() != null ? ability.getSource().getValue() : null);
                    ps.setString(4, ability.getSourceDescription());
                    ps.setString(5, ability.getRecovery());
                    ps.setInt(6, ability.getUsage() != null ? ability.getUsage().getValue() : null);
                    ps.setInt(7, ability.getAbilityId());
                });

        return ability;
    }

    public void deleteAbility(Integer abilityId) throws SQLException {
        this.data.Execute(
                DELETE_ABILITY_SQL,
                (PreparedStatement ps) -> ps.setInt(1, abilityId));
    }

    private Ability mapAbility(ResultSet rs) throws SQLException {
        Ability ability = new Ability();
        ability.setAbilityId(rs.getInt("ability_id"));
        ability.setCharacterId(rs.getInt("character_id"));
        ability.setName(rs.getString("name"));
        ability.setDescription(rs.getString("description"));

        Integer sourceValue = rs.getInt("source");
        if (sourceValue != null) {
            ability.setSource(AbilitySource.getByValue(sourceValue));
        }

        ability.setSourceDescription(rs.getString("source_description"));
        ability.setRecovery(rs.getString("recovery"));

        Integer usageValue = rs.getInt("usage");
        if (usageValue != null) {
            ability.setUsage(UsageType.getByValue(usageValue));
        }

        return ability;
    }
}
