package com.pantrylabel.controller;
import com.pantrylabel.dto.response.*;
import com.pantrylabel.service.ProductService;
import java.util.List;
import org.springframework.web.bind.annotation.*;
@RestController 
@RequestMapping("/api") 
public class ProductController { 
    private final ProductService service; 

    public ProductController(ProductService service) { 
        this.service = service; 
    } 

    @GetMapping("/states") 
    public List<StateDto> states() { 
        return service.getStates(); 
    } 

    @GetMapping("/categories") 
    public List<CategoryDto> categories() { 
        return service.getCategories(); 
    } 

    @GetMapping("/products") 
    public List<ProductDto> products(
            @RequestParam(required = false) Long state, 
            @RequestParam(required = false) Long category, 
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String lang) { 
        return service.getProducts(state, category, search, lang); 
    } 
}
