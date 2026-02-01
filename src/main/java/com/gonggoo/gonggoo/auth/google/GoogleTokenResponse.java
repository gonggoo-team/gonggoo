package com.gonggoo.gonggoo.auth.google;

public record GoogleTokenResponse(
        String access_token,
        int expires_in,
        String refresh_token,
        String scope,
        String token_type
) {
}
