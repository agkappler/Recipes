package com.fargopolis.enums;

import java.util.Map;

public enum BountyCadence {
	ONE_TIME(1),
    DAILY(2),
    WEEKLY(3),
    MONTHLY(4),
    QUARTERLY(5);

    private Integer value;
    
    private static final Map<Integer, BountyCadence> BY_VALUE = Map.of(
    		1, ONE_TIME,
    		2, DAILY,
    		3, WEEKLY,
    		4, MONTHLY,
    		5, QUARTERLY
		);

    BountyCadence(Integer value) {
        this.value = value;
    }

    public Integer getValue() {
        return value;
    }
    
    public static BountyCadence getByValue(Integer value) {
        return BY_VALUE.get(value);
    }
}