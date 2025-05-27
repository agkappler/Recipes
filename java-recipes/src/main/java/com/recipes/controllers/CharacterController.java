package com.recipes.controllers;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.recipes.models.DndCharacter;
import com.recipes.services.CharacterService;

@RestController
public class CharacterController extends BaseApiController {
	@Autowired
    private CharacterService characterService;
    
    @GetMapping("/characters")
    public ResponseEntity<List<DndCharacter>> getCharacters() throws Exception {
    	logger.info("Characters endpoint");
    	this.permissions.canRead();
    	
		List<DndCharacter> characters = characterService.getCharacters();
		return ResponseEntity.ok(characters);
    }
    
    @PostMapping("/createCharacter")
    public ResponseEntity<DndCharacter> createBounty(@RequestBody DndCharacter character) throws SQLException {
    	logger.info("Create Character Endpoint");
		this.permissions.canWrite();
		
		characterService.createCharacter(character);
    	return ResponseEntity.ok(character);
    }
    
    @PostMapping("/updateCharacter")
    public ResponseEntity<DndCharacter> updateBounty(@RequestBody DndCharacter character) throws SQLException {
    	logger.info("Update Character Endpoint");
		this.permissions.canWrite();
		
		characterService.updateCharacter(character);
    	return ResponseEntity.ok(character);
    }
}
