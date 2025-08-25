package com.fargopolis.controllers;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fargopolis.models.DndSubclass;
import com.fargopolis.models.SubclassFeature;
import com.fargopolis.services.DndSubclassService;
import com.fargopolis.services.SubclassFeatureService;

@RestController
public class DndSubclassController extends BaseApiController {
    @Autowired
    private DndSubclassService dndSubclassService;

    @Autowired
    private SubclassFeatureService subclassFeatureService;

    @GetMapping("/subclasses/{subclassId}")
    public ResponseEntity<DndSubclass> getSubclassById(@PathVariable("subclassId") Integer subclassId)
            throws SQLException {
        this.permissions.canRead();
        DndSubclass subclass = dndSubclassService.getSubclassById(subclassId);
        return ResponseEntity.ok(subclass);
    }

    @GetMapping("/subclasses/class/{classIndex}")
    public ResponseEntity<List<DndSubclass>> getSubclassesByClass(@PathVariable("classIndex") String classIndex)
            throws SQLException {
        this.permissions.canRead();
        List<DndSubclass> subclasses = dndSubclassService.getSubclassesByClass(classIndex);
        return ResponseEntity.ok(subclasses);
    }

    @PostMapping("/subclasses/createSubclass")
    public ResponseEntity<DndSubclass> createSubclass(@RequestBody DndSubclass subclass) throws SQLException {
        this.permissions.canWrite();
        DndSubclass createdSubclass = dndSubclassService.createSubclass(subclass);
        return ResponseEntity.ok(createdSubclass);
    }

    @PutMapping("/subclasses/updateSubclass/{subclassId}")
    public ResponseEntity<DndSubclass> updateSubclass(
            @PathVariable("subclassId") Integer subclassId,
            @RequestBody DndSubclass subclass) throws SQLException {
        this.permissions.canWrite();
        subclass.setSubclassId(subclassId);
        DndSubclass updatedSubclass = dndSubclassService.updateSubclass(subclass);
        return ResponseEntity.ok(updatedSubclass);
    }

    @DeleteMapping("/subclasses/deleteSubclass/{subclassId}")
    public ResponseEntity<Void> deleteSubclass(@PathVariable("subclassId") Integer subclassId) throws SQLException {
        this.permissions.canWrite();
        dndSubclassService.deleteSubclass(subclassId);
        return ResponseEntity.ok().build();
    }

    // Subclass Features endpoints
    @GetMapping("/subclasses/{subclassId}/features")
    public ResponseEntity<List<SubclassFeature>> getFeaturesForSubclass(@PathVariable("subclassId") Integer subclassId)
            throws SQLException {
        this.permissions.canRead();
        List<SubclassFeature> features = subclassFeatureService.getFeaturesForSubclass(subclassId);
        return ResponseEntity.ok(features);
    }

    @PostMapping("/subclasses/{subclassId}/updateFeatures")
    public ResponseEntity<List<SubclassFeature>> updateFeaturesForSubclass(
            @PathVariable("subclassId") Integer subclassId,
            @RequestBody List<SubclassFeature> features) throws SQLException {
        this.permissions.canWrite();
        List<SubclassFeature> updatedFeatures = subclassFeatureService.updateFeaturesForSubclass(subclassId, features);
        return ResponseEntity.ok(updatedFeatures);
    }
}
