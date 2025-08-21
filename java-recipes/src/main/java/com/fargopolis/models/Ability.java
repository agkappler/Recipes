package com.fargopolis.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fargopolis.enums.AbilitySource;

@Getter
@Setter
@NoArgsConstructor
public class Ability {
    private Integer abilityId;
    private Integer characterId;
    private String name;
    private String description;
    private AbilitySource source;
    private String sourceDescription;
    private String usage;
}
