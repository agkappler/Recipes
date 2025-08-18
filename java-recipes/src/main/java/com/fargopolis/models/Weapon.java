package com.fargopolis.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Weapon {
    private Integer weaponId;
    private Integer characterId;
    private String name;
    private String damage;
    private String description;
}
