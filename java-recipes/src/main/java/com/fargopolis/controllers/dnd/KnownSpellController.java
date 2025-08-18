package com.fargopolis.controllers.dnd;

import java.sql.SQLException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fargopolis.controllers.BaseApiController;
import com.fargopolis.models.KnownSpell;
import com.fargopolis.services.dnd.KnownSpellService;

@RestController
public class KnownSpellController extends BaseApiController {
    @Autowired
    private KnownSpellService knownSpellService;

    @GetMapping("/character/{characterId}/knownSpells")
    public ResponseEntity<Map<String, KnownSpell>> getKnownSpells(@PathVariable("characterId") Integer characterId)
            throws SQLException {
        this.permissions.canRead();
        Map<String, KnownSpell> spells = knownSpellService.getKnownSpells(characterId);
        return ResponseEntity.ok(spells);
    }

    @PostMapping("/character/{characterId}/addKnownSpell")
    public ResponseEntity<KnownSpell> addKnownSpell(
            @PathVariable("characterId") Integer characterId,
            @RequestBody KnownSpell spell) throws SQLException {
        this.permissions.canWrite();
        spell.setCharacterId(characterId);
        knownSpellService.addKnownSpell(spell);
        return ResponseEntity.ok(spell);
    }

    // @PostMapping("/character/{characterId}/updateKnownSpell")
    // public ResponseEntity<KnownSpell> updateKnownSpell(
    // @PathVariable("characterId") Integer characterId,
    // @RequestBody KnownSpell spell) throws SQLException {
    // this.permissions.canWrite();
    // spell.setCharacterId(characterId);
    // knownSpellService.updateKnownSpell(spell);
    // return ResponseEntity.ok(spell);
    // }

    @DeleteMapping("/character/{characterId}/deleteKnownSpell")
    public ResponseEntity<Void> deleteKnownSpell(
            @PathVariable("characterId") Integer characterId,
            @RequestParam("spellKey") String spellKey) throws SQLException {
        this.permissions.canWrite();
        knownSpellService.deleteKnownSpell(characterId, spellKey);
        return ResponseEntity.ok().build();
    }
}
