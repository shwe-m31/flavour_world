package com.pantrylabel.mapper;

import com.pantrylabel.dto.response.*;
import com.pantrylabel.entity.*;
import org.springframework.stereotype.Component;

@Component
public class DtoMapper {
    public UserDto user(User value) {
        return UserDto.builder()
                .id(value.getId())
                .username(value.getUsername())
                .email(value.getEmail())
                .name(value.getName())
                .gender(value.getGender())
                .age(value.getAge())
                .kitchenType(value.getKitchenType())
                .stateId(value.getState() == null ? null : value.getState().getId())
                .stateName(value.getState() == null ? null : value.getState().getName())
                .profileCompleted(value.isProfileCompleted())
                .build();
    }
    public StateDto state(State value) { return StateDto.builder().id(value.getId()).name(value.getName()).build(); }
    public CategoryDto category(Category value) { return CategoryDto.builder().id(value.getId()).name(value.getName()).description(value.getDescription()).build(); }
    private String cleanText(String text, String fallback) {
        if (text == null) return fallback;
        String cleaned = text.replaceAll("\\(cid:\\d+\\)", "").replaceAll("[?]{2,}", "").trim();
        cleaned = cleaned.replaceAll("^[()?,.-]+|[()?,.-]+$", "").trim();
        if (cleaned.isBlank() || cleaned.length() < 2 || cleaned.chars().allMatch(c -> c == '?' || c == ' ' || c == '-' || c == '(' || c == ')')) {
            return fallback;
        }
        return cleaned;
    }

    public ProductDto product(Product value) {
        String cleanEnName = cleanText(value.getName(), "Ingredient");
        String cleanTamil = cleanText(value.getTamilName(), cleanEnName);
        String cleanBilingual = cleanText(value.getBilingualName(), cleanTamil);
        return ProductDto.builder()
                .id(value.getId())
                .productCode(value.getProductCode())
                .name(cleanEnName)
                .subCategory(value.getSubCategory())
                .bilingualName(cleanBilingual)
                .tamilName(cleanTamil)
                .hindiName(cleanText(value.getHindiName(), cleanEnName))
                .teluguName(cleanText(value.getTeluguName(), cleanEnName))
                .kannadaName(cleanText(value.getKannadaName(), cleanEnName))
                .malayalamName(cleanText(value.getMalayalamName(), cleanEnName))
                .bengaliName(cleanText(value.getBengaliName(), cleanEnName))
                .marathiName(cleanText(value.getMarathiName(), cleanEnName))
                .gujaratiName(cleanText(value.getGujaratiName(), cleanEnName))
                .punjabiName(cleanText(value.getPunjabiName(), cleanEnName))
                .odiaName(cleanText(value.getOdiaName(), cleanEnName))
                .assameseName(cleanText(value.getAssameseName(), cleanEnName))
                .urduName(cleanText(value.getUrduName(), cleanEnName))
                .price(value.getPrice() != null ? value.getPrice() : new java.math.BigDecimal("2.00"))
                .imageUrl(value.getImageUrl())
                .stateId(value.getState() == null ? null : value.getState().getId())
                .categoryId(value.getCategory() == null ? null : value.getCategory().getId())
                .build();
    }
    public AddressDto address(Address value) { return AddressDto.builder().id(value.getId()).name(value.getName()).phone(value.getPhone()).flatHouseNo(value.getFlatHouseNo()).areaStreetName(value.getAreaStreetName()).landmark(value.getLandmark()).city(value.getCity()).state(value.getState()).pincode(value.getPincode()).build(); }
    public CartItemDto cartItem(CartItem value) { return CartItemDto.builder().cartItemId(value.getId()).product(product(value.getProduct())).build(); }
    public OrderItemDto orderItem(OrderItem value) { return OrderItemDto.builder().id(value.getId()).product(product(value.getProduct())).build(); }
}
