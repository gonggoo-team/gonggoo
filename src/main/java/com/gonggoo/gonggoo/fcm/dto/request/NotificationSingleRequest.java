package com.gonggoo.gonggoo.fcm.dto.request;

import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NonNull;

@Builder(access = AccessLevel.PRIVATE)
public record NotificationSingleRequest(
    @NonNull String tartgetToken,
    String title,
    String body
) implements NotificationRequest{
    public static NotificationSingleRequest of(String targetToken, String title, String body) {
        return NotificationSingleRequest.builder()
                .tartgetToken(targetToken)
                .title(title)
                .body(body)
                .build();
    }

    public Message.Builder buildMessage() {
        return Message.builder()
                .setToken(tartgetToken)
                .setNotification(toNotification());
    }

    public Notification toNotification() {
        return Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build();
    }
}
