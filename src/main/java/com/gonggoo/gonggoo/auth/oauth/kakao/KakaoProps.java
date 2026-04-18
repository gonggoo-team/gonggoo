package com.gonggoo.gonggoo.auth.oauth.kakao;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "oauth.kakao")
public record KakaoProps(
        String client_id,
        String redirect_uri,
        String client_secret,
        String post_uri,
        String user_info_url
) {
}
