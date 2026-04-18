package com.gonggoo.gonggoo.auth.jwt;

import static com.gonggoo.gonggoo.global.response.ErrorCode.NO_AUTHORITY;
import static com.gonggoo.gonggoo.global.response.ErrorCode.TOKEN_EXPIRED;
import static com.gonggoo.gonggoo.global.response.ErrorCode.UNAUTHORIZED_TOKEN;

import com.gonggoo.gonggoo.auth.dto.CustomPrincipal;
import com.gonggoo.gonggoo.global.domain.Role;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import com.gonggoo.gonggoo.global.response.ErrorCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
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

    public JwtTokenDto generateToken(String id, Role role) {
        String accessToken = generateAccessToken(id, role);
        String refreshToken = generateRefreshToken(id);

        return JwtTokenDto.builder()
                .grantType(BEARER_TYPE)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public String generateAccessToken(String id, Role role) {
        long now = (new Date()).getTime();

        return Jwts.builder()
                .subject(id)
                .claim(AUTHORITIES_KEY, role.authority())
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

    public boolean verifyToken(String token) {
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

    public void validateToken(String token) {
        if (!token.split(" ")[0].equals("Bearer")) {
            throw new NeighborsException(ErrorCode.INVALID_AUTH_HEADER);
        }
    }

    public Authentication getAuthentication(String accessToken) {
        Claims claim = parseClaims(accessToken);
        Object authClaim = claim.get(AUTHORITIES_KEY);
        if (authClaim == null) {
            throw new NeighborsException(NO_AUTHORITY);
        }

        Collection<? extends GrantedAuthority> authorities = Arrays.stream(claim.get(AUTHORITIES_KEY).toString().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        int memberId = Integer.parseInt(claim.getSubject());
        String role = authClaim.toString();

        CustomPrincipal customPrincipal = new CustomPrincipal(memberId, role);

        return new UsernamePasswordAuthenticationToken(customPrincipal, null, authorities);
    }

    public String resolveToken(HttpServletRequest req) {
        String bearerToken = req.getHeader("Authorization");
        if (bearerToken == null || bearerToken.isBlank()) return null;

        if (bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7).trim();
        }
        return bearerToken.trim();
    }

    public Claims parseClaims(String accessToken) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(accessToken)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            throw new NeighborsException(TOKEN_EXPIRED);
        } catch (JwtException e) {
            throw new NeighborsException(UNAUTHORIZED_TOKEN);
        } catch (IllegalArgumentException e) {
            throw new NeighborsException(UNAUTHORIZED_TOKEN);
        }
    }

    public String parseSubject(String token){
        try{
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
        } catch (ExpiredJwtException e) {
            throw new NeighborsException(TOKEN_EXPIRED);
        } catch (JwtException e) {
            throw new NeighborsException(UNAUTHORIZED_TOKEN);
        } catch (IllegalArgumentException e) {
            throw new NeighborsException(UNAUTHORIZED_TOKEN);
        }
    }
}
