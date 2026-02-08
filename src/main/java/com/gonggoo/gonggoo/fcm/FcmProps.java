package com.gonggoo.gonggoo.fcm;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "fcm")
public record FcmProps(
        String file_path,
        String project_id
) {
}
