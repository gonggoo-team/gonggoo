package com.gonggoo.gonggoo.member.dto.response;


import com.gonggoo.gonggoo.common.domain.GeoLocation;
import com.gonggoo.gonggoo.common.domain.Role;
import com.gonggoo.gonggoo.member.domain.Member;

public record MemberResponse (
        int id,
        String nickname,
        String phoneNumber,
        String email,
        String profileImage,
        Role role,
        GeoLocation location
) {
    public static MemberResponse from(final Member member) {
        return new MemberResponse(
                member.getId(),
                member.getNickname(),
                member.getPhoneNumber(),
                member.getEmail(),
                member.getProfileImage(),
                member.getRole(),
                member.getLocation()
                );
    }
}
