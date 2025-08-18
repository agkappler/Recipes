package com.fargopolis.services.dnd;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.fargopolis.models.Weapon;
import com.fargopolis.services.BaseService;
import com.utils.data.Data;

@Service
public class WeaponService extends BaseService {

    private static final String GET_WEAPONS_SQL = "SELECT * FROM weapons WHERE character_id = ?";
    private static final String GET_WEAPON_BY_ID_SQL = "SELECT * FROM weapons WHERE weapon_id = ?";
    private static final String INSERT_WEAPON_SQL = "INSERT INTO weapons (character_id, name, damage, description) VALUES (?, ?, ?, ?) RETURNING weapon_id";
    private static final String UPDATE_WEAPON_SQL = "UPDATE weapons SET name = ?, damage = ?, description = ? WHERE weapon_id = ?";
    private static final String DELETE_WEAPON_SQL = "DELETE FROM weapons WHERE weapon_id = ?";

    public WeaponService(DataSource dataSource, Data data) {
        super(dataSource, data);
    }

    public List<Weapon> getWeapons(Integer characterId) throws SQLException {
        List<Weapon> weapons = this.data.Query(
                GET_WEAPONS_SQL,
                (PreparedStatement ps) -> ps.setInt(1, characterId),
                (ResultSet rs) -> mapWeapon(rs));
        return weapons;
    }

    public Weapon getWeaponById(Integer weaponId) throws SQLException {
        List<Weapon> weapons = this.data.Query(
                GET_WEAPON_BY_ID_SQL,
                (PreparedStatement ps) -> ps.setInt(1, weaponId),
                (ResultSet rs) -> mapWeapon(rs));

        if (weapons.isEmpty()) {
            throw new IllegalArgumentException("Weapon not found with ID: " + weaponId);
        }

        return weapons.get(0);
    }

    public Weapon addWeapon(Weapon weapon) throws SQLException {
        Integer weaponId = this.data.InsertWithKey(
                INSERT_WEAPON_SQL,
                (PreparedStatement ps) -> {
                    ps.setInt(1, weapon.getCharacterId());
                    ps.setString(2, weapon.getName());
                    ps.setString(3, weapon.getDamage());
                    ps.setString(4, weapon.getDescription());
                });
        weapon.setWeaponId(weaponId);
        return weapon;
    }

    public Weapon updateWeapon(Weapon weapon) throws SQLException {
        // First verify the weapon exists
        this.getWeaponById(weapon.getWeaponId());

        // Update the weapon
        this.data.Execute(
                UPDATE_WEAPON_SQL,
                (PreparedStatement ps) -> {
                    ps.setString(1, weapon.getName());
                    ps.setString(2, weapon.getDamage());
                    ps.setString(3, weapon.getDescription());
                    ps.setInt(4, weapon.getWeaponId());
                });

        return weapon;
    }

    public void deleteWeapon(Integer weaponId) throws SQLException {
        this.data.Execute(
                DELETE_WEAPON_SQL,
                (PreparedStatement ps) -> ps.setInt(1, weaponId));
    }

    private Weapon mapWeapon(ResultSet rs) throws SQLException {
        Weapon weapon = new Weapon();
        weapon.setWeaponId(rs.getInt("weapon_id"));
        weapon.setCharacterId(rs.getInt("character_id"));
        weapon.setName(rs.getString("name"));
        weapon.setDamage(rs.getString("damage"));
        weapon.setDescription(rs.getString("description"));
        return weapon;
    }
}
