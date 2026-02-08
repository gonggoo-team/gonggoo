package com.gonggoo.gonggoo.fcm.dto.request;

import com.google.firebase.messaging.Notification;

public interface NotificationRequest {
    String title();
    String body();
    Notification toNotification();
}
