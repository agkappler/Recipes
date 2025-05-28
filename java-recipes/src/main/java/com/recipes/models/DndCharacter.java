package com.recipes.models;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.ALWAYS)
public class DndCharacter {
	private Integer characterId;
	private String name;
	private String race;
	private String subrace;
	private String className;
	private String subclassName;
	private Integer level;
	private Integer avatarId;
}
