package com.example.TrainingAPI.service;

import com.example.TrainingAPI.exceptions.APIException;
import com.example.TrainingAPI.exceptions.ResourceNotFoundException;
import com.example.TrainingAPI.model.Category;
import com.example.TrainingAPI.payload.CategoryDTO;
import com.example.TrainingAPI.payload.CategoryResponse;
import com.example.TrainingAPI.repository.CategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class CategoryServiceImpl implements CategoryService{


    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;


    @Override
    public CategoryResponse getAllCategory(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {

        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber,pageSize,sortByAndOrder);
        Page<Category> categoryPage=categoryRepository.findAll(pageDetails);
        List<Category>categories = categoryPage.getContent();
        if(categories.isEmpty()){
            throw new APIException("There is no category at all");
        }
        List<CategoryDTO> categoryDTOs = categories.stream().map(category -> modelMapper.map(category,CategoryDTO.class)).toList();

        CategoryResponse categoryResponse = new CategoryResponse();
        categoryResponse.setContent(categoryDTOs);
        categoryResponse.setPageNumber(categoryPage.getNumber());
        categoryResponse.setPageSize(categoryPage.getSize());
        categoryResponse.setTotalElements(categoryPage.getTotalElements());
        categoryResponse.setTotalPages(categoryPage.getTotalPages());
        categoryResponse.setLastPage(categoryPage.isLast());
        return categoryResponse;
    }

    @Override
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = modelMapper.map(categoryDTO, Category.class);
        Category CategoryFromDB = categoryRepository.findByCategoryName(category.getCategoryName());
        if(CategoryFromDB !=null){
            throw new APIException("Category with the name "+category.getCategoryName()+" already exists");
        }

        Category savedCategory=categoryRepository.save(category);
        return modelMapper.map(savedCategory, CategoryDTO.class);

    }

    @Override
    public CategoryDTO deleteCategory(Long CategoryId) {
        Category category = categoryRepository.findById(CategoryId)
                .orElseThrow(()->new ResourceNotFoundException("Category","categoryId",CategoryId));
        CategoryDTO categoryDTO= modelMapper.map(category, CategoryDTO.class);
        categoryRepository.delete(category);
        return categoryDTO;
    }

    @Override
    public CategoryDTO updateCategory(CategoryDTO categoryDTO, Long CategoryId){
        Category category = modelMapper.map(categoryDTO, Category.class);
        Category categoryInDB = categoryRepository.findById(CategoryId)
                .orElseThrow(()->new ResourceNotFoundException("Category","categoryId",CategoryId));
        category.setCategoryId(CategoryId);
        categoryInDB = categoryRepository.save(category);
        return modelMapper.map(categoryInDB, CategoryDTO.class);
    }
}
