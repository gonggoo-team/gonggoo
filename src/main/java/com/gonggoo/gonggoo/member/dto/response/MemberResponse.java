package com.gonggoo.gonggoo.member.dto.response;


import com.gonggoo.gonggoo.auth.domain.RegistrationProvider;
import com.gonggoo.gonggoo.common.domain.GeoLocation;
import com.gonggoo.gonggoo.common.domain.Role;
import com.gonggoo.gonggoo.member.domain.Member;
import java.time.LocalDateTime;

public record MemberResponse (
        int id,
        String nickname,
        String phoneNumber,
        String email,
        String profileImage,
        Role role,
        RegistrationProvider provider,
        String providerId,
        GeoLocation location,
        LocalDateTime createdAt,
        LocalDateTime modifiedAt,
        LocalDateTime deletedAt
) {
    public static MemberResponse from(final Member member) {
        return new MemberResponse(
                member.getId(),
                member.getNickname(),
                member.getPhoneNumber(),
                member.getEmail(),
                member.getProfileImage(),
                member.getRole(),
                member.getProvider(),
                member.getProviderId(),
                member.getLocation(),
                member.getCreatedAt(),
                member.getModifiedAt(),
                member.getDeletedAt()
                );
    }
}
