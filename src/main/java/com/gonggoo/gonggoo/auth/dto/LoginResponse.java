package com.gonggoo.gonggoo.auth.dto;

import com.gonggoo.gonggoo.common.domain.GeoLocation;
import com.gonggoo.gonggoo.common.domain.Role;
import com.gonggoo.gonggoo.member.domain.Member;

public record LoginResponse(
        String nickname,
        String phoneNumber,
        String email,
        String profileImage,
        Role role,
        GeoLocation Location
) {
    public static LoginResponse from(final Member member) {
        return new LoginResponse(
                member.getNickname(),
                member.getPhoneNumber(),
                member.getEmail(),
                member.getProfileImage(),
                member.getRole(),
                member.getLocation()
        );
    }
}
