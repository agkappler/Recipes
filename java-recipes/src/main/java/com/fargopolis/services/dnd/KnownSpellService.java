package com.fargopolis.services.dnd;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.fargopolis.models.KnownSpell;
import com.fargopolis.services.BaseService;
import com.utils.data.Data;

@Service
public class KnownSpellService extends BaseService {

    private static final String GET_KNOWN_SPELLS_SQL = "SELECT * FROM known_spells WHERE character_id = ?";
    private static final String INSERT_KNOWN_SPELL_SQL = "INSERT INTO known_spells (character_id, spell_name, spell_key, spell_level) VALUES (?, ?, ?, ?)";
    private static final String DELETE_KNOWN_SPELL_SQL = "DELETE FROM known_spells WHERE character_id = ? AND spell_key = ?";

    public KnownSpellService(DataSource dataSource, Data data) {
        super(dataSource, data);
    }

    public Map<String, KnownSpell> getKnownSpells(Integer characterId) throws SQLException {
        List<KnownSpell> spells = this.data.Query(
                GET_KNOWN_SPELLS_SQL,
                (PreparedStatement ps) -> ps.setInt(1, characterId),
                (ResultSet rs) -> mapKnownSpell(rs));
        return spells.stream().collect(Collectors.toMap(KnownSpell::getSpellKey, s -> s));
    }

    public KnownSpell addKnownSpell(KnownSpell spell) throws SQLException {
        this.data.Execute(
                INSERT_KNOWN_SPELL_SQL,
                (PreparedStatement ps) -> {
                    ps.setInt(1, spell.getCharacterId());
                    ps.setString(2, spell.getSpellName());
                    ps.setString(3, spell.getSpellKey());
                    ps.setInt(4, spell.getSpellLevel() != null ? spell.getSpellLevel() : 0);
                });
        return spell;
    }

    public void deleteKnownSpell(Integer characterId, String spellKey) throws SQLException {
        this.data.Execute(
                DELETE_KNOWN_SPELL_SQL,
                (PreparedStatement ps) -> {
                    ps.setInt(1, characterId);
                    ps.setString(2, spellKey);
                });
    }

    private KnownSpell mapKnownSpell(ResultSet rs) throws SQLException {
        KnownSpell spell = new KnownSpell();
        spell.setCharacterId(rs.getInt("character_id"));
        spell.setSpellName(rs.getString("spell_name"));
        spell.setSpellKey(rs.getString("spell_key"));
        spell.setSpellLevel(rs.getInt("spell_level"));
        return spell;
    }
}
