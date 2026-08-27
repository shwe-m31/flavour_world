package com.pantrylabel.service.impl;
import com.pantrylabel.dto.response.*;
import com.pantrylabel.mapper.DtoMapper;
import com.pantrylabel.repository.*;
import com.pantrylabel.service.ProductService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service 
public class ProductServiceImpl implements ProductService {
    private final StateRepository states; 
    private final CategoryRepository categories; 
    private final ProductRepository products; 
    private final DtoMapper mapper;

    public ProductServiceImpl(StateRepository states, CategoryRepository categories, ProductRepository products, DtoMapper mapper) { 
        this.states = states; 
        this.categories = categories; 
        this.products = products; 
        this.mapper = mapper; 
    }

    @Override 
    @Transactional(readOnly = true) 
    public List<StateDto> getStates() { 
        return states.findAll().stream().map(mapper::state).toList(); 
    }

    @Override 
    @Transactional(readOnly = true) 
    public List<CategoryDto> getCategories() { 
        return categories.findAll().stream().map(mapper::category).toList(); 
    }

    @Override 
    @Transactional(readOnly = true) 
    public List<ProductDto> getProducts(Long stateId, Long categoryId, String search) {
        return getProducts(stateId, categoryId, search, null);
    }

    @Override 
    @Transactional(readOnly = true) 
    public List<ProductDto> getProducts(Long stateId, Long categoryId, String search, String lang) { 
        boolean hasSearch = search != null && !search.isBlank();
        List<ProductDto> result;

        if (hasSearch) {
            result = products.searchProducts(stateId, categoryId, search.trim()).stream().map(mapper::product).toList();
        } else if (stateId != null && categoryId != null) {
            result = products.findByStateIdAndCategoryId(stateId, categoryId).stream().map(mapper::product).toList();
        } else if (stateId != null) {
            result = products.findByStateId(stateId).stream().map(mapper::product).toList();
        } else if (categoryId != null) {
            result = products.findByCategoryId(categoryId).stream().map(mapper::product).toList();
        } else {
            result = products.findAll().stream().map(mapper::product).toList();
        }

        if (lang != null && !lang.isBlank()) {
            String l = lang.trim().toLowerCase();
            result.forEach(p -> {
                String translatedName = switch (l) {
                    case "tamil" -> p.getTamilName();
                    case "hindi" -> p.getHindiName();
                    case "telugu" -> p.getTeluguName();
                    case "kannada" -> p.getKannadaName();
                    case "malayalam" -> p.getMalayalamName();
                    case "bengali" -> p.getBengaliName();
                    case "marathi" -> p.getMarathiName();
                    case "gujarati" -> p.getGujaratiName();
                    case "punjabi" -> p.getPunjabiName();
                    case "odia" -> p.getOdiaName();
                    case "assamese" -> p.getAssameseName();
                    case "urdu" -> p.getUrduName();
                    default -> p.getBilingualName();
                };
                if (translatedName != null && !translatedName.isBlank()) {
                    p.setBilingualName(translatedName);
                }
            });
        }

        return result;
    }
}
