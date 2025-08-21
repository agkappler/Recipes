package com.fargopolis.controllers.dnd;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fargopolis.controllers.BaseApiController;
import com.fargopolis.models.Ability;
import com.fargopolis.services.dnd.AbilityService;

@RestController
public class AbilityController extends BaseApiController {
    @Autowired
    private AbilityService abilityService;

    @GetMapping("/characterAbilities/{characterId}")
    public ResponseEntity<List<Ability>> getAbilities(@PathVariable("characterId") Integer characterId)
            throws SQLException {
        this.permissions.canRead();
        List<Ability> abilities = abilityService.getAbilities(characterId);
        return ResponseEntity.ok(abilities);
    }

    @GetMapping("/ability/{abilityId}")
    public ResponseEntity<Ability> getAbility(@PathVariable("abilityId") Integer abilityId) throws SQLException {
        this.permissions.canRead();
        Ability ability = abilityService.getAbilityById(abilityId);
        return ResponseEntity.ok(ability);
    }

    @PostMapping("/addAbility/{characterId}")
    public ResponseEntity<Ability> addAbility(
            @PathVariable("characterId") Integer characterId,
            @RequestBody Ability ability) throws SQLException {
        this.permissions.canWrite();
        ability.setCharacterId(characterId);
        Ability createdAbility = abilityService.addAbility(ability);
        return ResponseEntity.ok(createdAbility);
    }

    @PutMapping("/updateAbility/{abilityId}")
    public ResponseEntity<Ability> updateAbility(
            @PathVariable("abilityId") Integer abilityId,
            @RequestBody Ability ability) throws SQLException {
        this.permissions.canWrite();
        ability.setAbilityId(abilityId);
        Ability updatedAbility = abilityService.updateAbility(ability);
        return ResponseEntity.ok(updatedAbility);
    }

    @DeleteMapping("/deleteAbility/{abilityId}")
    public ResponseEntity<Void> deleteAbility(@PathVariable("abilityId") Integer abilityId) throws SQLException {
        this.permissions.canWrite();
        abilityService.deleteAbility(abilityId);
        return ResponseEntity.ok().build();
    }
}
