package com.example.TrainingAPI.controller;

import com.example.TrainingAPI.model.Cart;
import com.example.TrainingAPI.payload.CartDTO;
import com.example.TrainingAPI.repository.CartRepository;
import com.example.TrainingAPI.service.CartService;
import com.example.TrainingAPI.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private AuthUtil authUtil;

    @Autowired
    private CartRepository cartRepository;

    @PostMapping("/carts/products/{productId}/quantity/{quantity}")
    public ResponseEntity<CartDTO>addProductToCart(@PathVariable Long productId,
                                                   @PathVariable Integer quantity){
        CartDTO cartDTO = cartService.addProductToCart(productId, quantity);
        return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.CREATED);
    }

    @GetMapping("/carts")
    public ResponseEntity<List<CartDTO>> getCarts(){
        List<CartDTO>cartDTOs = cartService.getAllCarts();
        return new ResponseEntity<>(cartDTOs,HttpStatus.FOUND);
    }

    @GetMapping("/carts/users/cart")
    public ResponseEntity<CartDTO> getCartById(){
        String emailId = authUtil.loggedInEmail();
        Cart cart = cartRepository.findCartByEmail(emailId);
        Long cartId = cart.getCartId();
        CartDTO cartDTO=cartService.getCart(emailId,cartId);
        return new ResponseEntity<>(cartDTO,HttpStatus.FOUND);

    }
}
