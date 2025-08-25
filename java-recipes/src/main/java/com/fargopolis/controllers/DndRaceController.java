package com.fargopolis.controllers;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.fargopolis.models.DndRace;
import com.fargopolis.models.DndRaceTrait;
import com.fargopolis.services.DndRaceService;
import com.fargopolis.services.DndRaceTraitService;

@RestController
public class DndRaceController extends BaseApiController {
    @Autowired
    private DndRaceService dndRaceService;

    @Autowired
    private DndRaceTraitService dndRaceTraitService;

    @GetMapping("/races")
    public ResponseEntity<List<DndRace>> getDndRaces() throws Exception {
        this.permissions.canRead();

        List<DndRace> races = this.permissions.isAuthenticated() ? dndRaceService.getDndRaces() : new ArrayList<>();
        return ResponseEntity.ok(races);
    }

    @GetMapping("/races/{raceId}")
    public ResponseEntity<DndRace> getDndRace(@PathVariable("raceId") Integer raceId) throws Exception {
        this.permissions.canRead();

        DndRace race = this.permissions.isAuthenticated() ? dndRaceService.getDndRace(raceId) : null;
        return ResponseEntity.ok(race);
    }

    @PostMapping("/createRace")
    public ResponseEntity<DndRace> createRace(@RequestBody DndRace race) throws SQLException {
        this.permissions.canWrite();

        dndRaceService.createDndRace(race);
        return ResponseEntity.ok(race);
    }

    @GetMapping("/races/{raceId}/traits")
    public ResponseEntity<List<DndRaceTrait>> getTraitsForRace(@PathVariable("raceId") Integer raceId)
            throws SQLException {
        this.permissions.canRead();

        List<DndRaceTrait> traits = dndRaceTraitService.getTraitsForRace(raceId);
        return ResponseEntity.ok(traits);
    }

    @PostMapping("/races/{raceId}/updateTraits")
    public ResponseEntity<List<DndRaceTrait>> updateTraitsForRace(
            @PathVariable("raceId") Integer raceId,
            @RequestBody List<DndRaceTrait> traits) throws SQLException {
        this.permissions.canWrite();

        List<DndRaceTrait> updatedTraits = dndRaceTraitService.updateTraitsForRace(raceId, traits);
        return ResponseEntity.ok(updatedTraits);
    }
}
