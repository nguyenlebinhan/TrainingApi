package com.example.TrainingAPI.service;

import com.example.TrainingAPI.exceptions.APIException;
import com.example.TrainingAPI.exceptions.ResourceNotFoundException;
import com.example.TrainingAPI.model.*;
import com.example.TrainingAPI.payload.OrderDTO;
import com.example.TrainingAPI.payload.OrderItemDTO;
import com.example.TrainingAPI.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class OrderServiceImpl implements OrderService{

    @Autowired
    CartRepository cartRepository;

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CartService cartService;

    @Autowired
    ModelMapper modelMapper;

    @Override
    public OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage) {

        Cart cart=cartRepository.findCartByEmail(emailId);
        if(cart == null){
            throw new ResourceNotFoundException("Cart","email",emailId);
        }
        Address address= addressRepository.findById(addressId)
                .orElseThrow(()->new ResourceNotFoundException("Address","addressId",addressId));

        Order order = new Order();
        order.setEmail(emailId);
        order.setOrderDate(LocalDate.now());
        order.setTotalAmount(cart.getTotalPrice());
        order.setOrderStatus("Order Accepted!");

        Payment payment = new Payment(paymentMethod,pgPaymentId,pgStatus,pgResponseMessage,pgName);
        payment.setOrder(order);
        payment = paymentRepository.save(payment);
        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);


        List<CartItem> cartItems = cart.getCartItems();
        if(cartItems.isEmpty()){
            throw new APIException("Cart is empty");
        }
        List<OrderItem> orderItems =new ArrayList<>();
        for(CartItem cartItem: cartItems){
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setDiscount(cartItem.getDiscount());
            orderItem.setOrderedProductPrice(cartItem.getProductPrice());
            orderItem.setOrder(savedOrder);
            orderItems.add(orderItem);
        }

        orderItems=orderItemRepository.saveAll(orderItems);

        cart.getCartItems().forEach(item->{
            int quantity = item.getQuantity();
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity()-quantity);
            productRepository.save(product);

            //clear the cart
            cartService.deleteProductFromCart(cart.getCartId(),item.getProduct().getProductId());
        });

        OrderDTO orderDTO = modelMapper.map(savedOrder,OrderDTO.class);
        orderItems.forEach(item ->
                orderDTO.getOrderItems().add(
                        modelMapper.map(item, OrderItemDTO.class)));

        orderDTO.setAddressId(addressId);
        return orderDTO;
    }
}
