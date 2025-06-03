package com.recipes.controllers;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.recipes.dto.ImageUrl;
import com.recipes.models.DndCharacter;
import com.recipes.services.CharacterService;
import com.recipes.services.FileService;

@RestController
public class CharacterController extends BaseApiController {
	@Autowired
    private CharacterService characterService;
	
	@Autowired
	private FileService fileService;
    
    @GetMapping("/characters")
    public ResponseEntity<List<DndCharacter>> getCharacters() throws Exception {
    	logger.info("Characters endpoint");
    	this.permissions.canRead();
    	
		List<DndCharacter> characters = characterService.getCharacters();
		return ResponseEntity.ok(characters);
    }
    
    @GetMapping("/character/{characterId}")
    public ResponseEntity<DndCharacter> getCharacter(@PathVariable("characterId") Integer characterId) throws Exception {
    	logger.info("Character endpoint for " + characterId);
    	this.permissions.canRead();
    	
		DndCharacter character = characterService.getCharacter(characterId);
		return ResponseEntity.ok(character);
    }
    
    @PostMapping("/createCharacter")
    public ResponseEntity<DndCharacter> createCharacter(@RequestBody DndCharacter character) throws SQLException {
    	logger.info("Create Character Endpoint");
		this.permissions.canWrite();
		
		characterService.createCharacter(character);
    	return ResponseEntity.ok(character);
    }
    
    @PostMapping("/updateCharacter")
    public ResponseEntity<DndCharacter> updateCharacter(@RequestBody DndCharacter character) throws SQLException {
    	logger.info("Update Character Endpoint");
		this.permissions.canWrite();
		
		characterService.updateCharacter(character);
    	return ResponseEntity.ok(character);
    }
    
    @PostMapping("/updateAvatar")
    public ResponseEntity<ImageUrl> updateAvatar(
    		@RequestParam("characterId") Integer characterId,
    		@RequestParam("fileId") Integer fileId
	) throws Exception {
    	logger.info("Update Avatar Endpoint");
		this.permissions.canWrite();
		
		characterService.updateAvatar(characterId, fileId);
		String avatarUrl = fileService.getUrlForFileById(fileId);
		
    	return ResponseEntity.ok(new ImageUrl(avatarUrl));
    }
}
