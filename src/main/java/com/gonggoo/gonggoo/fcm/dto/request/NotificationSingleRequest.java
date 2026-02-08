package com.gonggoo.gonggoo.fcm.dto.request;

import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import java.util.Map;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NonNull;

@Builder(access = AccessLevel.PRIVATE)
public record NotificationSingleRequest(
    @NonNull String targetToken,
    String title,
    String body,
    Map<String, String> data
) implements NotificationRequest{
    public static NotificationSingleRequest of(String targetToken, String title, String body) {
        return NotificationSingleRequest.builder()
                .targetToken(targetToken)
                .title(title)
                .body(body)
                .build();
    }

    public Message.Builder buildMessage() {
        return Message.builder()
                .setToken(targetToken)
                .setNotification(toNotification())
                .putAllData(data);
    }

    public Notification toNotification() {
        return Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build();
    }
}
