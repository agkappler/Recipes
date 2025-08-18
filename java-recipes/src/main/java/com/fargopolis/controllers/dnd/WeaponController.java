package com.fargopolis.controllers.dnd;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fargopolis.controllers.BaseApiController;
import com.fargopolis.models.Weapon;
import com.fargopolis.services.dnd.WeaponService;

@RestController
public class WeaponController extends BaseApiController {
    @Autowired
    private WeaponService weaponService;

    @GetMapping("/characterWeapons/{characterId}")
    public ResponseEntity<List<Weapon>> getWeapons(@PathVariable("characterId") Integer characterId)
            throws SQLException {
        this.permissions.canRead();
        List<Weapon> weapons = weaponService.getWeapons(characterId);
        return ResponseEntity.ok(weapons);
    }

    @PostMapping("/addWeapon")
    public ResponseEntity<Weapon> addWeapon(
            @RequestBody Weapon weapon) throws SQLException {
        this.permissions.canWrite();
        weaponService.addWeapon(weapon);
        return ResponseEntity.ok(weapon);
    }

    @GetMapping("/weapon/{weaponId}")
    public ResponseEntity<Weapon> getWeapon(@PathVariable("weaponId") Integer weaponId) throws SQLException {
        this.permissions.canRead();
        Weapon weapon = weaponService.getWeaponById(weaponId);
        return ResponseEntity.ok(weapon);
    }

    @PutMapping("/updateWeapon/{weaponId}")
    public ResponseEntity<Weapon> updateWeapon(
            @PathVariable("weaponId") Integer weaponId,
            @RequestBody Weapon weapon) throws SQLException {
        this.permissions.canWrite();
        weapon.setWeaponId(weaponId);
        Weapon updatedWeapon = weaponService.updateWeapon(weapon);
        return ResponseEntity.ok(updatedWeapon);
    }

    @DeleteMapping("/deleteWeapon/{weaponId}")
    public ResponseEntity<Void> deleteWeapon(@PathVariable("weaponId") Integer weaponId) throws SQLException {
        this.permissions.canWrite();
        weaponService.deleteWeapon(weaponId);
        return ResponseEntity.ok().build();
    }
}
