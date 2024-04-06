package com.recipes;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.GenerationType;

@Entity
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rowid;

    private String name;

    public String GetName() {
        return this.name;
    }

    public void SetName(String newName){
        this.name = newName;
    }

    public Long GetId() {
        return this.rowid;
    }

    public void SetId(Long id){
        this.rowid = id;
    }

    @Override
    public String toString() {
        return "Recipe{" +
                "id=" + rowid +
                ", name='" + name +
                '}';
    }
}
