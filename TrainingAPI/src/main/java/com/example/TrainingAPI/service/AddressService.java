package com.example.TrainingAPI.service;

import com.example.TrainingAPI.model.User;
import com.example.TrainingAPI.payload.AddressDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface AddressService {
    AddressDTO createAddress(AddressDTO addressDTO, User user);

    List<AddressDTO> getAllAddress();

    AddressDTO getAddressesById(Long addressId);

    List<AddressDTO> getAddressesByUserId(User user);

    AddressDTO updateAddresses(@Valid AddressDTO addressDTO, Long addressId);

    String deleteAddress(Long addressId);
}
