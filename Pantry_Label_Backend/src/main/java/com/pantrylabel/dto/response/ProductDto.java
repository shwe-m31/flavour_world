package com.pantrylabel.dto.response;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String productCode;
    private String name;
    private String subCategory;
    private String bilingualName;
    private String tamilName;
    private String hindiName;
    private String teluguName;
    private String kannadaName;
    private String malayalamName;
    private String bengaliName;
    private String marathiName;
    private String gujaratiName;
    private String punjabiName;
    private String odiaName;
    private String assameseName;
    private String urduName;
    private BigDecimal price;
    private String imageUrl;
    private Long stateId;
    private Long categoryId;
}
