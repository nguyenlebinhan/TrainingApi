package com.example.TrainingAPI.Repository;

import com.example.TrainingAPI.Model.Category;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository <Category,Long> {
    Category findByCategoryName(String categoryName);
}
