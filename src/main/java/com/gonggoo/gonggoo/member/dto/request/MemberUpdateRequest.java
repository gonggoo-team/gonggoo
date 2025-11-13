package com.gonggoo.gonggoo.member.dto.request;

public record MemberUpdateRequest(
        String nickname,
        String phoneNumber,
        String email,
        String profileImage
) {
}
