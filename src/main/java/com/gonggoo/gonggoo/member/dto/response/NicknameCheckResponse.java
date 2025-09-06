package com.gonggoo.gonggoo.member.dto.response;

public record NicknameCheckResponse(
        String nickname,
        boolean exists
) {
    public static NicknameCheckResponse of(String nickname, boolean exists) {
        return new NicknameCheckResponse(nickname, exists);
    }
}
