package com.example.TrainingAPI.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.convert.DataSizeUnit;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequestDTO {
    private Long addressId;
    private String paymentMethod;
    private String pgName;
    private String pgPaymentId;
    private String pgStatus;
    private String pgResponseMessage;
}
