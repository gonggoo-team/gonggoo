package com.gonggoo.gonggoo.jwt;

import com.gonggoo.gonggoo.common.domain.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {
    private final String AUTHORITIES_KEY = "auth";
    private final String BEARER_TYPE = "Bearer";

    private final JwtProps jwtProps;
    private final SecretKey key;

    public JwtTokenProvider(JwtProps jwtProps, @Value("${jwt.secret}") String key) {
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

    public Authentication getAuthentication(String accessToken) {
        Claims claim = parseClaims(accessToken);

        if (claim.get(AUTHORITIES_KEY) == null) {
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        Collection<? extends GrantedAuthority> authorities = Arrays.stream(claim.get(AUTHORITIES_KEY).toString().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        return new UsernamePasswordAuthenticationToken(claim.getSubject(), "", authorities);
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
