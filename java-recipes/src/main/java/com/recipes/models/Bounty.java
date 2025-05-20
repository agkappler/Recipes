package com.recipes.models;

import java.time.LocalDate;

import com.recipes.enums.BountyStatus;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Bounty {
	private Integer bountyId;
	private String title;
	private String description;
	private BountyStatus status;
	private Integer categoryId;
	private LocalDate expirationDate;
}
