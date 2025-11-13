package com.gonggoo.gonggoo.auth.dto;

public record LoginRequest(
        String email,
        String password
) {
}