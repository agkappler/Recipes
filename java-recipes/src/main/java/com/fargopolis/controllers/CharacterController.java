package com.fargopolis.controllers;

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

import com.fargopolis.dto.ImageUrl;
import com.fargopolis.models.DndCharacter;
import com.fargopolis.services.CharacterService;
import com.fargopolis.services.FileService;

@RestController
public class CharacterController extends BaseApiController {
	@Autowired
    private CharacterService characterService;
	
	@Autowired
	private FileService fileService;
    
    @GetMapping("/characters")
    public ResponseEntity<List<DndCharacter>> getCharacters() throws Exception {
    	this.permissions.canRead();
    	
		List<DndCharacter> characters = characterService.getCharacters();
		return ResponseEntity.ok(characters);
    }
    
    @GetMapping("/character/{characterId}")
    public ResponseEntity<DndCharacter> getCharacter(@PathVariable("characterId") Integer characterId) throws Exception {
    	this.permissions.canRead();
    	
		DndCharacter character = characterService.getCharacter(characterId);
		return ResponseEntity.ok(character);
    }
    
    @PostMapping("/createCharacter")
    public ResponseEntity<DndCharacter> createCharacter(@RequestBody DndCharacter character) throws SQLException {
		this.permissions.canWrite();
		
		characterService.createCharacter(character);
    	return ResponseEntity.ok(character);
    }
    
    @PostMapping("/updateCharacter")
    public ResponseEntity<DndCharacter> updateCharacter(@RequestBody DndCharacter character) throws SQLException {
		this.permissions.canWrite();
		
		characterService.updateCharacter(character);
    	return ResponseEntity.ok(character);
    }
    
    @PostMapping("/updateAvatar")
    public ResponseEntity<ImageUrl> updateAvatar(
    		@RequestParam("characterId") Integer characterId,
    		@RequestParam("fileId") Integer fileId
	) throws Exception {
		this.permissions.canWrite();
		
		characterService.updateAvatar(characterId, fileId);
		String avatarUrl = fileService.getUrlForFileById(fileId);
		
    	return ResponseEntity.ok(new ImageUrl(avatarUrl));
    }
    
    @GetMapping("/character/{characterId}/resourceIds")
    public ResponseEntity<List<Integer>> getResourceIds(@PathVariable("characterId") Integer characterId) throws Exception {
    	this.permissions.canRead();
    	
		List<Integer> resourceIds = characterService.getResourceFileIds(characterId);
		return ResponseEntity.ok(resourceIds);
    }
    
    @PostMapping("/character/addResource")
    public ResponseEntity<ImageUrl> addResource(
    		@RequestParam("characterId") Integer characterId,
    		@RequestParam("fileId") Integer fileId
	) throws Exception {
		this.permissions.canWrite();
		
		characterService.addResource(characterId, fileId);
		String resourceUrl = fileService.getUrlForFileById(fileId);
		
    	return ResponseEntity.ok(new ImageUrl(resourceUrl));
    }
}
