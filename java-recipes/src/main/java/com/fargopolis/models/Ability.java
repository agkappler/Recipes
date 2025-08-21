package com.fargopolis.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fargopolis.enums.AbilitySource;
import com.fargopolis.enums.UsageType;

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
    private String recovery;
    private UsageType usage;
}
