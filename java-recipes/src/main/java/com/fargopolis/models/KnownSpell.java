package com.fargopolis.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class KnownSpell {
    private Integer characterId;
    private String spellName;
    private String spellKey;
    private Integer spellLevel;
}
