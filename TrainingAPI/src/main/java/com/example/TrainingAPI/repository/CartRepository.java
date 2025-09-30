package com.example.TrainingAPI.repository;

import com.example.TrainingAPI.model.Cart;
import com.example.TrainingAPI.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart,Long> {
    @Query("Select c from Cart c where c.user.email = ?1")
    Cart findCartByEmail(String email);

    @Query("Select c from Cart c where c.user.email = ?1 And c.id = ?2 ")
    Cart findCartByEmailAndCartId(String emailId, Long cartId);

    @Query("Select c from Cart c Join fetch c.cartItems ci join fetch ci.product p where p.id = ?1 ")
    List<Cart> findCartByProductId(Long productId);
}
