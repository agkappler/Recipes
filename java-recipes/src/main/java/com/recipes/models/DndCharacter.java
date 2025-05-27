package com.recipes.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DndCharacter {
	private Integer characterId;
	private String name;
	private String race;
	private String subrace;
	private String className;
	private String subclassName;
	private Integer level;
}
