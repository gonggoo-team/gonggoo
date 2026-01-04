package com.gonggoo.gonggoo.auth.dto;

public record CustomPrincipal(
        int memberId,
        String role
) {
}
