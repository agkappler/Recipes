package com.fargopolis.controllers;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fargopolis.models.DndCharacter;
import com.fargopolis.models.DndRace;
import com.fargopolis.services.DndRaceService;

@RestController
public class DndRaceController extends BaseApiController {
	@Autowired
	private DndRaceService dndRaceService;
	
	@GetMapping("/races")
    public ResponseEntity<List<DndRace>> getDndRaces() throws Exception {
    	this.permissions.canRead();
    	
		List<DndRace> races = this.permissions.isAuthenticated() ? dndRaceService.getDndRaces() : new ArrayList<>();
		return ResponseEntity.ok(races);
    }
	
	@PostMapping("/createRace")
    public ResponseEntity<DndRace> createRace(@RequestBody DndRace race) throws SQLException {
		this.permissions.canWrite();
		
		dndRaceService.createDndRace(race);
    	return ResponseEntity.ok(race);
    }
}
