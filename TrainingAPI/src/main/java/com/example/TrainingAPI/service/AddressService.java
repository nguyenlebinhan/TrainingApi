package com.example.TrainingAPI.service;

import com.example.TrainingAPI.model.User;
import com.example.TrainingAPI.payload.AddressDTO;

public interface AddressService {
    AddressDTO createAddress(AddressDTO addressDTO, User user);
}
