package com.gonggoo.gonggoo.member.dto.request;

import com.gonggoo.gonggoo.auth.domain.RegistrationProvider;
import com.gonggoo.gonggoo.global.domain.GeoLocation;

public record MemberSignupRequest(
        String nickname,
        String phoneNumber,
        String email,
        String password,
        RegistrationProvider provider,
        String providerId,
        GeoLocation location
) {
}
