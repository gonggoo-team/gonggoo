package com.gonggoo.gonggoo.auth.oauth.kakao;

import com.fasterxml.jackson.annotation.JsonProperty;

public record KakaoUserInfoResponse(
        Long id,
        @JsonProperty("kakao_account") KakaoAccount kakaoAccount
) {
    public record KakaoAccount(
            String email,
            Profile profile
    ) {
        public record Profile(
                String nickname,
                @JsonProperty("thumnail_image_url") String thumnailImageUrl
        ) {
        }
    }

    public String getEmail() {
        return kakaoAccount().email();
    }

    public String getNickname() {
        return kakaoAccount().profile().nickname();
    }

    public String getProfileImage() {
        return kakaoAccount().profile().thumnailImageUrl();
    }
}
