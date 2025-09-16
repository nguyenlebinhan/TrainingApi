package com.example.TrainingAPI.repository;

import com.example.TrainingAPI.model.Category;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository <Category,Long> {
    Category findByCategoryName(String categoryName);
}
