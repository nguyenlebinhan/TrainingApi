package com.example.TrainingAPI.controller;

import com.example.TrainingAPI.model.User;
import com.example.TrainingAPI.payload.AddressDTO;
import com.example.TrainingAPI.service.AddressService;
import com.example.TrainingAPI.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api")
@RestController
public class AddressController {

    @Autowired
    AddressService addressService;

    @Autowired
    AuthUtil authUtil;

    @PostMapping("/addresses")
    public ResponseEntity<AddressDTO> createAddress(@Valid @RequestBody AddressDTO addressDTO){
        User user = authUtil.loggedInUser();
        AddressDTO savedAddressDTO = addressService.createAddress(addressDTO,user);
        return new ResponseEntity<>(savedAddressDTO, HttpStatus.CREATED);
    }
    @GetMapping("/addresses")
    public ResponseEntity<List<AddressDTO>>getAllAddress(){
        List<AddressDTO> addressDTOs = addressService.getAllAddress();
        return new ResponseEntity<>(addressDTOs,HttpStatus.OK);
    }

    @GetMapping("/addresses/{addressId}")
    public ResponseEntity<AddressDTO> getAddressesById(@PathVariable Long addressId){
        AddressDTO addressDTO = addressService.getAddressesById(addressId);
        return new ResponseEntity<>(addressDTO,HttpStatus.OK);
    }

    @GetMapping("/user/addresses")
    public ResponseEntity<List<AddressDTO>> getAddressesByUserId(){
        User user = authUtil.loggedInUser();
        List<AddressDTO>addressDTOs= addressService.getAddressesByUserId(user);
        return new ResponseEntity<>(addressDTOs,HttpStatus.OK);
    }

    @PutMapping("/user/addresses/{addressId}")
    public ResponseEntity<AddressDTO> updateAddresses(@Valid @RequestBody AddressDTO addressDTO,
                                                  @PathVariable Long addressId){
        AddressDTO address = addressService.updateAddresses(addressDTO,addressId);
        return new ResponseEntity<>(address,HttpStatus.OK);
    }

    @DeleteMapping("/user/addresses/{addressId}")
    public ResponseEntity<String> deleteAddresses(@PathVariable Long addressId){
        String status = addressService.deleteAddresses(addressId);
        return new ResponseEntity<>(status,HttpStatus.OK);
    }

}
