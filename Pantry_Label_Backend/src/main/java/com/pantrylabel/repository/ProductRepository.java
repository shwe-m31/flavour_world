package com.pantrylabel.repository;

import com.pantrylabel.entity.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStateId(Long stateId);
    
    List<Product> findByCategoryId(Long categoryId);
    
    List<Product> findByStateIdAndCategoryId(Long stateId, Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE " +
           "(:stateId IS NULL OR p.state.id = :stateId) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.subCategory) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.productCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.bilingualName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.tamilName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.hindiName) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Product> searchProducts(@Param("stateId") Long stateId, @Param("categoryId") Long categoryId, @Param("search") String search);
}
