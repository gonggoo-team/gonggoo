package com.gonggoo.gonggoo.jwt;

import com.gonggoo.gonggoo.common.domain.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.util.List;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {
    private final String AUTHORITIES_KEY = "auth";
    private final String BEARER_TYPE = "Bearer";

    private final JwtProps jwtProps;
    private final SecretKey key;

    public JwtTokenProvider(JwtProps jwtProps, String key) {
        byte[] keyBytes = Decoders.BASE64.decode(key);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.jwtProps = jwtProps;
    }

    public JwtTokenDto generateToken(String id, List<Role> roles) {
        String accessToken = generateAccessToken(id, roles);
        String refreshToken = generateRefreshToken(id);

        return JwtTokenDto.builder()
                .grantType(BEARER_TYPE)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public String generateAccessToken(String id, List<Role> roles) {
        long now = (new Date()).getTime();

        return Jwts.builder()
                .subject(id)
                .claim(AUTHORITIES_KEY, roles)
                .expiration(new Date(now + jwtProps.expireSeconds()))
                .issuedAt(new Date(now))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(String id) {
        long now = (new Date()).getTime();

        return Jwts.builder()
                .subject(id)
                .expiration(new Date(now + jwtProps.refreshExpireSeconds()))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            throw new JwtException(e.getMessage());
        }
    }

    public Claims parseClaims(String accessToken) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(accessToken)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }
}
