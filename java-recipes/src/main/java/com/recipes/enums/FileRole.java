package com.recipes.enums;

import java.util.Map;

public enum FileRole {
	CHARACTER_AVATAR(1),
    CHARACTER_RESOURCE(2),
    RECIPE_IMAGE(3),
    RESUME(4);
	
	private Integer value;
    
    private static final Map<Integer, FileRole> BY_VALUE = Map.of(
    		1, CHARACTER_AVATAR,
    		2, CHARACTER_RESOURCE,
    		3, RECIPE_IMAGE,
    		4, RESUME
		);

    FileRole(Integer value) {
        this.value = value;
    }

    public Integer getValue() {
        return value;
    }

    public static FileRole getByValue(Integer value) {
        return BY_VALUE.get(value);
    }
}
