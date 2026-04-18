package com.gonggoo.gonggoo.auth.oauth.google;

public record GoogleUserInfoResponse(
        String sub,
        String email,
        String given_name,
        String family_name,
        String name,
        String picture
) {
}
