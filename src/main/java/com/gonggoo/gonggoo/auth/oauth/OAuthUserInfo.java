package com.gonggoo.gonggoo.auth.oauth;

import com.gonggoo.gonggoo.auth.domain.RegistrationProvider;

public record OAuthUserInfo(
        RegistrationProvider provider,
        String providerId,
        String email,
        String nickname,
        String profileImage,
        String phoneNumber
) {
}
