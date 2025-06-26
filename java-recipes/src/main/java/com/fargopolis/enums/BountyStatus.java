package com.fargopolis.enums;

import java.util.Map;

public enum BountyStatus {
	ACTIVE(1),
    COMPLETE(2),
    OVERDUE(3);

    private Integer value;
    
    private static final Map<Integer, BountyStatus> BY_VALUE = Map.of(
    		1, ACTIVE,
    		2, COMPLETE,
    		3, OVERDUE
		);

    BountyStatus(Integer value) {
        this.value = value;
    }

    public Integer getValue() {
        return value;
    }

    public static BountyStatus getByValue(Integer value) {
        return BY_VALUE.get(value);
    }
}