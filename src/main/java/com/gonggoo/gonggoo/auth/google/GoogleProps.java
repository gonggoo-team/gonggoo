package com.gonggoo.gonggoo.auth.google;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "oauth.google")
public record GoogleProps(
        String client_id,
        String redirect_uri,
        String client_secret,
        String post_uri,
        String user_info_url,
        String scope
) {
}
