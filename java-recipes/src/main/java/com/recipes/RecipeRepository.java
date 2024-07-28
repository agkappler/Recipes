package com.recipes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.recipes.Recipe;

import java.util.List;
import java.util.Optional;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

//    @Query("select * from lu_recipes;")
//    List<Recipe> findRecipes();
    List<Recipe> findAll();

//    @Query("select * from lu_recipes where rowid = ?1")
    Optional<Recipe> findById(Long id);
}
