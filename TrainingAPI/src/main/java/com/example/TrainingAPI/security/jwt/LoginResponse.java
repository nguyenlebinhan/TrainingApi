package com.example.TrainingAPI.security.jwt;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {
    private String jwtToken;

    private String username;
    private List<String> roles;
}
