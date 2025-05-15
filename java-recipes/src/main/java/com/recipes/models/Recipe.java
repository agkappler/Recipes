package com.recipes.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.GenerationType;

@Getter
@Setter
//@Entity
public class Recipe {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long rowid;
    private Integer recipeId;

    private String name;

//    public String GetName() {
//        return this.name;
//    }
//
//    public void SetName(String newName){
//        this.name = newName;
//    }
//
//    public Long GetId() {
//        return this.rowid;
//    }
//
//    public void SetId(Long id){
//        this.rowid = id;
//    }
    
    private String instructions;
    private Integer prepTimeMinutes;
    private Integer cookTimeMinutes;

    @Override
    public String toString() {
        return "Recipe{" +
                "recipeId=" + recipeId +
                ", name='" + name +
                '}';
    }
}
