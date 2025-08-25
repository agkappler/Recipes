package com.fargopolis.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SubclassFeature {
    private Integer subclassFeatureId;
    private Integer subclassId;
    private String name;
    private String description;
    private Integer level;
}
