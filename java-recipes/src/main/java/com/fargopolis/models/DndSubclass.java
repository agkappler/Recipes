package com.fargopolis.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DndSubclass {
    private Integer subclassId;
    private String name;
    private String index;
    private String classIndex;
    private Boolean isCustomClass;
    private Boolean isCustom;
}
