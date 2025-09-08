package com.gonggoo.gonggoo.jwt;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "jwt")
public record JwtProps (
    String issuer,
    String secret,
    long expireSeconds,
    long refreshExpireSeconds
) {}
