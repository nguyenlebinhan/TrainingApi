package com.example.TrainingAPI.repository;

import com.example.TrainingAPI.model.AppRole;
import com.example.TrainingAPI.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Long> {

    Optional<Role> findByRoleName(AppRole appRole);
}
