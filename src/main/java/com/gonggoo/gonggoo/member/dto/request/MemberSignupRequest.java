package com.gonggoo.gonggoo.member.dto.request;

import com.gonggoo.gonggoo.auth.domain.RegistrationProvider;
import com.gonggoo.gonggoo.common.domain.GeoLocation;

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
