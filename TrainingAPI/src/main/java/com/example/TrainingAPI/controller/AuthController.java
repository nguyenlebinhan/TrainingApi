package com.example.TrainingAPI.controller;

import com.example.TrainingAPI.security.jwt.JwtUtils;
import com.example.TrainingAPI.security.jwt.LoginRequest;
import com.example.TrainingAPI.security.jwt.LoginResponse;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.naming.AuthenticationException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class AuthController {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/signin")
    public ResponseEntity<?>authenticateUser(@RequestBody LoginRequest loginRequest){
        Authentication authentication;
        try{
            authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest));
        }catch (AuthenticationException exception){
            Map<String,Object> map =new HashMap<>();
            map.put("message","Bad credentials");
            map.put("status",false);
            return new ResponseEntity<Object>(map, HttpStatus.NOT_FOUND);
        }
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrinCipal();

        String jwtToken = jwtUtils.generateTokenFromUserName(userDetails);

        List<String> roles =userDetails.getAuthorities().stream().map(
                item->item.getAuthority())
                .collect(Collectors.toList());

        LoginResponse response = new LoginResponse(userDetails.getUsername(), );
        return ResponseEntity.ok(response);
    }
}
