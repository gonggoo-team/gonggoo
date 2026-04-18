package com.gonggoo.gonggoo.auth.oauth.naver;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "oauth.naver")
public record NaverProps(
        String client_id,
        String redirect_uri,
        String client_secret,
        String post_uri,
        String user_info_url
) {
}
