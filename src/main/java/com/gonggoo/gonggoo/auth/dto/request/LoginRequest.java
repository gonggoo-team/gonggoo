package com.gonggoo.gonggoo.auth.dto.request;

public record LoginRequest(
        String email,
        String password
) {
}