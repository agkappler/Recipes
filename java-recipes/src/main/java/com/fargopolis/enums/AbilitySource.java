package com.fargopolis.enums;

import java.util.Map;

public enum AbilitySource {
    CLASS(1),
    RACE(2),
    FEAT(3),
    OTHER(4);

    private Integer value;

    private static final Map<Integer, AbilitySource> BY_VALUE = Map.of(
            1, CLASS,
            2, RACE,
            3, FEAT,
            4, OTHER);

    AbilitySource(Integer value) {
        this.value = value;
    }

    public Integer getValue() {
        return value;
    }

    public static AbilitySource getByValue(Integer value) {
        return BY_VALUE.get(value);
    }
}
