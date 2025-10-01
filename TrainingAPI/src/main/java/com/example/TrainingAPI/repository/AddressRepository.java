package com.example.TrainingAPI.repository;

import com.example.TrainingAPI.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address,Long> {
}
