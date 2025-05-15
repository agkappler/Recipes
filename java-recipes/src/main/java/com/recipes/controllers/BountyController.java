package com.recipes.controllers;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.recipes.models.Bounty;
import com.recipes.services.BountyService;

@RestController
public class BountyController extends BaseApiController {

    private BountyService bountyService;

    @Autowired
    public BountyController(BountyService bountyService){
        this.bountyService = bountyService;
    }
    
    @GetMapping("/bounties")
    public ResponseEntity<List<Bounty>> GetBounties() throws Exception {
    	System.out.println("Bounties endpoint");
		List<Bounty> bounties = bountyService.getBounties();
		return ResponseEntity.ok(bounties);
    }
    
    @PostMapping("/createBounty")
    public ResponseEntity<Bounty> addIngredientToRecipe(@RequestBody Bounty bounty) throws SQLException {
		System.out.println("Create Bounty Endpoint");
		bountyService.createBounty(bounty);
    	
    	return ResponseEntity.ok(bounty);
    }
}
