package com.example.TrainingAPI.service;

import com.example.TrainingAPI.payload.OrderDTO;
import org.springframework.stereotype.Service;

public interface OrderService {
    OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage);
}
