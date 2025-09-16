package com.example.TrainingAPI.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    // Getting JWT from header

    private static final Logger LOGGER = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${spring.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    @Value("${spring.app.jwtSecret}")
    private String jwtSecret;

    public String getJwtFromHeader(HttpServletRequest request){
        String bearerToken = request.getHeader("Authorization");
        LOGGER.debug("Authorization Header: {}", bearerToken);
        if(bearerToken != null && bearerToken.startsWith("Bearer ")){
            return bearerToken.substring(7);// Remove Bearer to get the token

        }
        return null;
    }
    // Generate Token from Username

    public String generateTokenFromUserName(UserDetails userDetails){
        String userName = userDetails.getUsername();
        return Jwts.builder()
                .subject(userName)
                .issuedAt(new Date())
                .expiration( new Date((new Date().getTime() + jwtExpirationMs)))
                .signWith(key())
                .compact();
    }


    // Generate Token from Username
    public String getUserNameFromJWTToken(String token){
        return Jwts.parser()
                .verifyWith((SecretKey) key())
                .build()
                .parseSignedClaims(token)
                .getPayload().getSubject();
    }

    //Generate Signing Key

    public Key key(){
        return Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(jwtSecret)
        );
    }

    // Validate JWT Token

    public boolean validateJwtToken (String authToken){
        try{
            System.out.println("Validate");
            Jwts.parser()
                    .verifyWith((SecretKey) key())
                    .build()
                    .parseSignedClaims(authToken);
            return true;
        }catch (MalformedJwtException e){
            LOGGER.error("Invalid JWT token: {}", e.getMessage());
        }
        catch (ExpiredJwtException e){
            LOGGER.error("JWT token is expired: {}",e.getMessage());
        }
        catch (UnsupportedJwtException e){
            LOGGER.error("JWT token is unsupported: {}", e.getMessage());
        }
        catch (IllegalArgumentException e){
            LOGGER.error("JWT claims string is empty: {}",e.getMessage());
        }
        return false;
    }


}
