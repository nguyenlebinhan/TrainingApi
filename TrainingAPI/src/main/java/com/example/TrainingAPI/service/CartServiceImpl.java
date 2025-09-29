package com.example.TrainingAPI.service;

import com.example.TrainingAPI.exceptions.APIException;
import com.example.TrainingAPI.exceptions.ResourceNotFoundException;
import com.example.TrainingAPI.model.Cart;
import com.example.TrainingAPI.model.CartItem;
import com.example.TrainingAPI.model.Product;
import com.example.TrainingAPI.payload.CartDTO;
import com.example.TrainingAPI.payload.ProductDTO;
import com.example.TrainingAPI.repository.CartItemRepository;
import com.example.TrainingAPI.repository.CartRepository;
import com.example.TrainingAPI.repository.ProductRepository;
import com.example.TrainingAPI.util.AuthUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class CartServiceImpl implements CartService{

    @Autowired
    CartRepository cartRepository;

    @Autowired
    private AuthUtil authUtil;

    @Autowired
    ModelMapper modelMapper;


    @Autowired
    ProductRepository productRepository;

    @Autowired
    CartItemRepository cartItemRepository;

    @Override
    public CartDTO addProductToCart(Long productId, Integer quantity) {
        //Find existing cart or create one
        Cart cart = createCart();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product","productId",productId));

        //Perform validations

        CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(
                cart.getCartId(),
                productId
        );

        if(cartItem != null){
            throw new APIException("Product "+ product.getProductName()+" already exists in the cart");
        }
        if(product.getQuantity() == 0){
            throw new APIException("Product "+ product.getProductName()+" is not available");
        }

        if(product.getQuantity() < quantity){
            throw new APIException("Please, make an order of the "+ product.getProductName()
            +" less than or equal to the quantity "+product.getQuantity()+".");
        }

        //Create Cart Item

        CartItem newCartItem = new CartItem();
        newCartItem.setProduct(product);
        newCartItem.setCart(cart);
        newCartItem.setQuantity(quantity);
        newCartItem.setDiscount(product.getDiscount());
        newCartItem.setProductPrice(product.getSpecialPrice());

        //Save Cart Item
        cartItemRepository.save(newCartItem);

        product.setQuantity(product.getQuantity() );

        cart.setTotalPrice(cart.getTotalPrice() + (product.getSpecialPrice() * quantity));

        cartRepository.save(cart);


        //return updated cart
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);

        List<CartItem> cartItems= cart.getCartItems();

        Stream<ProductDTO> productDTOStream = cartItems.stream().map(item->{
            ProductDTO map = modelMapper.map(item.getProduct(), ProductDTO.class);
            map.setQuantity(item.getQuantity());
            return map;
        });
        cartDTO.setProducts(productDTOStream.toList());

        return cartDTO;

    }

    private Cart createCart(){
        Cart userCart = cartRepository.findCartByEmail(authUtil.loggedInEmail());
        if(userCart != null){
            return userCart;
        }
        Cart cart = new Cart();
        cart.setTotalPrice(0.00);
        cart.setUser(authUtil.loggedInUser());
        return cartRepository.save(cart);
    }

    @Override
    public List<CartDTO> getAllCarts() {
        List<Cart> carts = cartRepository.findAll();

        if(carts.isEmpty()){
            throw new APIException("No carts exists");
        }

        List<CartDTO> cartDTOs = carts.stream()
                .map(cart ->{
                    CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
                    List<ProductDTO> products = cart.getCartItems().stream()
                            .map(p -> modelMapper.map(p.getProduct(),ProductDTO.class))
                            .toList();

                    cartDTO.setProducts(products);
                    return cartDTO;
                }).toList();
        return cartDTOs;
    }

    @Override
    public CartDTO getCart(String emailId, Long cartId) {
        Cart cart = cartRepository.findCartByEmailAndCartId(emailId,cartId);
        if(cart == null){
            throw  new ResourceNotFoundException("Cart","cartId",cartId);
        }
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
        List<ProductDTO>productDTOs= cart.getCartItems().stream()
                .map(p -> modelMapper.map(p.getProduct(), ProductDTO.class))
                .toList();
        cartDTO.setProducts(productDTOs);
        return cartDTO;
    }
}
