package com.recipes;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;
import jakarta.persistence.GenerationType;

@Entity
@Data
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String instructions;
    private int prepTimeMinutes;
    private int cookTimeMinutes;
    
    public Recipe(){}
    public Recipe(long id, String name, String instructions, int prepTimeMinutes, int cookTimeMinutes){
    	this.id = id;
        this.name = name;
        this.instructions = instructions;
        this.prepTimeMinutes = prepTimeMinutes;
        this.cookTimeMinutes = cookTimeMinutes;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String newName){
        this.name = newName;
    }

    public long getId() {
        return this.id;
    }

    public void setId(long id){
        this.id = id;
    }
    
    public String getInstructions(){
    	return this.instructions;
    }
    
    public void setInstructions(String instructions) {
    	this.instructions = instructions;
    }
    
    public int getPrepTimeMinutes() {
    	return this.prepTimeMinutes;
    }
    
    public void setPrepTimeMinutes(int prepTimeMinutes) {
    	this.prepTimeMinutes = prepTimeMinutes;
    }
    
    public int getCookTimeMinutes() {
    	return this.cookTimeMinutes;
    }
    
    public void setCookTimeMinutes(int cookTimeMinutes) {
    	this.cookTimeMinutes = cookTimeMinutes;
    }

    @Override
    public String toString() {
        return "Recipe{" +
                "id=" + id +
                "name:'" + name + "'" +
                '}';
    }
}
