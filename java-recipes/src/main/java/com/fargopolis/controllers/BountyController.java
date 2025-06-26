package com.fargopolis.controllers;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fargopolis.models.Bounty;
import com.fargopolis.models.BountyCategory;
import com.fargopolis.services.BountyCategoryService;
import com.fargopolis.services.BountyService;

@RestController
public class BountyController extends BaseApiController {

	@Autowired
    private BountyService bountyService;

    @Autowired
    private BountyCategoryService bountyCategoryService;
    
    @GetMapping("/bounties")
    public ResponseEntity<List<Bounty>> GetBounties() throws Exception {
    	this.permissions.canRead();
    	
		List<Bounty> bounties = bountyService.getBounties();
		return ResponseEntity.ok(bounties);
    }
    
    @PostMapping("/createBounty")
    public ResponseEntity<Bounty> createBounty(@RequestBody Bounty bounty) throws SQLException {
		this.permissions.canWrite();
		
		bountyService.createBounty(bounty);
    	return ResponseEntity.ok(bounty);
    }
    
    @PostMapping("/updateBounty")
    public ResponseEntity<Bounty> updateBounty(@RequestBody Bounty bounty) throws SQLException {
		this.permissions.canWrite();
		
		bountyService.updateBounty(bounty);
    	return ResponseEntity.ok(bounty);
    }
    
    @GetMapping("/bountyCategories")
    public ResponseEntity<List<BountyCategory>> getBountyCategories() throws Exception {
    	this.permissions.canRead();
    	
		List<BountyCategory> bounties = bountyCategoryService.getBountyCategories();
		return ResponseEntity.ok(bounties);
    }
    
    @PostMapping("/createBountyCategory")
    public ResponseEntity<BountyCategory> createBountyCategory(@RequestBody BountyCategory bountyCategory) throws SQLException {
		this.permissions.canWrite();
		
		bountyCategoryService.createBountyCategory(bountyCategory);
    	return ResponseEntity.ok(bountyCategory);
    }
}
