package com.gonggoo.gonggoo.auth.oauth.naver;

public record NaverTokenResponse(
        String access_token,
        String refresh_token,
        String token_type,
        int expires_in,
        String error,
        String error_description
) {
}
