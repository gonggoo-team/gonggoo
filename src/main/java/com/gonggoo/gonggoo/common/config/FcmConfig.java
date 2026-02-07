package com.gonggoo.gonggoo.common.config;

import com.gonggoo.gonggoo.fcm.FcmProps;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

@Configuration
@EnableConfigurationProperties(FcmProps.class)
public class FcmConfig {

    private final ClassPathResource firebaseResource;
    private final String projectId;

    public FcmConfig(FcmProps fcmProps) {
        this.firebaseResource = new ClassPathResource(fcmProps.file_path());
        this.projectId = fcmProps.project_id();
    }

    @PostConstruct
    public void init() throws IOException {
        FirebaseOptions option = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(firebaseResource.getInputStream()))
                .setProjectId(projectId)
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(option);
        }
    }

    @Bean
    public FirebaseMessaging firebaseMessaging() {
        return FirebaseMessaging.getInstance(firebaseApp());
    }

    @Bean
    public FirebaseApp firebaseApp() {
        return FirebaseApp.getInstance();
    }
}
