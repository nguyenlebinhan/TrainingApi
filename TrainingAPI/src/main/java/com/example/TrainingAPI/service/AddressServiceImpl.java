package com.example.TrainingAPI.service;

import com.example.TrainingAPI.model.Address;
import com.example.TrainingAPI.model.User;
import com.example.TrainingAPI.payload.AddressDTO;
import com.example.TrainingAPI.repository.AddressRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    AddressRepository addressRepository;

    @Override
    public AddressDTO createAddress(AddressDTO addressDTO, User user) {
        Address address = modelMapper.map(addressDTO, Address.class);

        List<Address> addressList =user.getAddresses();
        addressList.add(address);
        user.setAddresses(addressList);

        List<User>users= new ArrayList<>();
        users.add(user);
        address.setUsers(users);
        Address saveAddress = addressRepository.save(address);

        return modelMapper.map(saveAddress,AddressDTO.class);
    }
}
