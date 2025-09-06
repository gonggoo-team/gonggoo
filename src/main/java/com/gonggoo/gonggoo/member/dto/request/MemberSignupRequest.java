package com.gonggoo.gonggoo.member.dto.request;

import com.gonggoo.gonggoo.common.domain.GeoLocation;

public record MemberSignupRequest(
        String nickname,
        String phoneNumber,
        String email,
        String password,
        GeoLocation location
) {
}
