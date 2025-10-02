package com.example.TrainingAPI.service;

import com.example.TrainingAPI.model.User;
import com.example.TrainingAPI.payload.AddressDTO;

import java.util.List;

public interface AddressService {
    AddressDTO createAddress(AddressDTO addressDTO, User user);

    List<AddressDTO> getAllAddress();

    AddressDTO getAddressesById(Long addressId);
}
