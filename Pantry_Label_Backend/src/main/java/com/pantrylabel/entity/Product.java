package com.pantrylabel.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_code")
    private String productCode;

    @Column(nullable = false)
    private String name;

    @Column(name = "sub_category")
    private String subCategory;

    @Column(name = "bilingual_name")
    private String bilingualName;

    @Column(name = "tamil_name")
    private String tamilName;

    @Column(name = "hindi_name")
    private String hindiName;

    @Column(name = "telugu_name")
    private String teluguName;

    @Column(name = "kannada_name")
    private String kannadaName;

    @Column(name = "malayalam_name")
    private String malayalamName;

    @Column(name = "bengali_name")
    private String bengaliName;

    @Column(name = "marathi_name")
    private String marathiName;

    @Column(name = "gujarati_name")
    private String gujaratiName;

    @Column(name = "punjabi_name")
    private String punjabiName;

    @Column(name = "odia_name")
    private String odiaName;

    @Column(name = "assamese_name")
    private String assameseName;

    @Column(name = "urdu_name")
    private String urduName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_id", nullable = true)
    private State state;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}
