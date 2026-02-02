package com.gonggoo.gonggoo.auth.google;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(GoogleProps.class)
public class GoogleConfig {
}
