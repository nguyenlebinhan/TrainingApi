package com.example.TrainingAPI.controller;


import com.example.TrainingAPI.config.AppConstants;
import com.example.TrainingAPI.payload.CategoryDTO;
import com.example.TrainingAPI.payload.CategoryResponse;
import com.example.TrainingAPI.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api")
@RestController
public class CategoryController {

    @Autowired
    private CategoryService categoryService;



    @GetMapping("/public/categories")
    public ResponseEntity<CategoryResponse> getAllCategories(
            @RequestParam(name = "pageNumber",defaultValue = AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
            @RequestParam(name = "pageSize",defaultValue = AppConstants.PAGE_SIZE,required = false) Integer pageSize,
            @RequestParam(name = "sortBy",defaultValue = AppConstants.SORT_CATEGORIES_BY,required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR,required = false) String sortOrder
    ){
        CategoryResponse categoryResponse = categoryService.getAllCategory(pageNumber, pageSize,sortBy,sortOrder);
        return new ResponseEntity<>(categoryResponse,HttpStatus.OK);
    }

    @PostMapping("/public/categories")
    public ResponseEntity<CategoryDTO> createCategory(@Valid  @RequestBody CategoryDTO categoryDTO){
        CategoryDTO savedCategoryDTO = categoryService.createCategory(categoryDTO);
        return new ResponseEntity<>(savedCategoryDTO,HttpStatus.CREATED);
    }

    @DeleteMapping("/admin/categories/{CategoryId}")
    public ResponseEntity<CategoryDTO>deleteCategory (@PathVariable Long CategoryId){
            CategoryDTO deletedCategoryDTO =categoryService.deleteCategory(CategoryId);
            return new ResponseEntity<>(deletedCategoryDTO, HttpStatus.OK);
    }

    @PutMapping("/public/categories/{CategoryId}")
    public ResponseEntity<CategoryDTO> updateCategory (@Valid @RequestBody CategoryDTO categoryDTO, @PathVariable Long CategoryId){
            CategoryDTO savedCategoryDTO = categoryService.updateCategory(categoryDTO, CategoryId);
            return new ResponseEntity<>(savedCategoryDTO, HttpStatus.OK);
    }
}
