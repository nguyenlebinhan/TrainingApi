package com.example.TrainingAPI.Service;

import com.example.TrainingAPI.Payload.CategoryDTO;
import com.example.TrainingAPI.Payload.CategoryResponse;


public interface CategoryService {
    CategoryResponse getAllCategory(Integer pageNumber,Integer pageSize,String sortBy,String sortOrder);

    CategoryDTO createCategory(CategoryDTO categoryDTO);

    public CategoryDTO deleteCategory (Long CategoryId);

    public CategoryDTO updateCategory(CategoryDTO categoryDTO, Long CategoryId);
}
