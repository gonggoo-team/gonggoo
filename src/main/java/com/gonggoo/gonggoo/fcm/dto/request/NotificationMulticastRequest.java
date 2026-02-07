package com.gonggoo.gonggoo.fcm.dto.request;

import com.google.firebase.messaging.MulticastMessage;
import com.google.firebase.messaging.Notification;
import java.util.List;
import java.util.Map;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NonNull;

@Builder(access = AccessLevel.PRIVATE)
public record NotificationMulticastRequest(
        @NonNull List<String> targetTokens,
        String title,
        String body,
        Map<String, String> data
) implements NotificationRequest{
    public static NotificationMulticastRequest of(List<String> targetTokens, String title, String body) {
        return NotificationMulticastRequest.builder()
                .targetTokens(targetTokens)
                .title(title)
                .body(body)
                .build();
    }

    public MulticastMessage.Builder buildSendMessage(Map<String, String> data) {
        return MulticastMessage.builder()
                .setNotification(toNotification())
                .putAllData(data)
                .addAllTokens(targetTokens);
    }

    public Notification toNotification() {
        return Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build();
    }
}
