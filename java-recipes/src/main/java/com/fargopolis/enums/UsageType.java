package com.fargopolis.enums;

import java.util.Map;

public enum UsageType {
    ACTION(1),
    BONUS_ACTION(2),
    REACTION(3),
    FREE(4),
    PASSIVE(5);

    private Integer value;

    private static final Map<Integer, UsageType> BY_VALUE = Map.of(
            1, ACTION,
            2, BONUS_ACTION,
            3, REACTION,
            4, FREE,
            5, PASSIVE);

    UsageType(Integer value) {
        this.value = value;
    }

    public Integer getValue() {
        return value;
    }

    public static UsageType getByValue(Integer value) {
        return BY_VALUE.get(value);
    }
}
