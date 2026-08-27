package com.pantrylabel.service;
import com.pantrylabel.dto.response.CategoryDto;
import com.pantrylabel.dto.response.ProductDto;
import com.pantrylabel.dto.response.StateDto;
import java.util.List;
public interface ProductService { 
    List<StateDto> getStates(); 
    List<CategoryDto> getCategories(); 
    List<ProductDto> getProducts(Long stateId, Long categoryId, String search);
    List<ProductDto> getProducts(Long stateId, Long categoryId, String search, String lang);
}
