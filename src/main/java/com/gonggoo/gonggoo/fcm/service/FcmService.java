package com.gonggoo.gonggoo.fcm.service;

import static com.gonggoo.gonggoo.global.response.ErrorCode.FCM_SERVICE_UNAVAILABLE;

import com.gonggoo.gonggoo.fcm.dto.request.NotificationMulticastRequest;
import com.gonggoo.gonggoo.fcm.dto.request.NotificationRequest;
import com.gonggoo.gonggoo.fcm.dto.request.NotificationSingleRequest;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import com.google.firebase.messaging.AndroidConfig;
import com.google.firebase.messaging.AndroidConfig.Priority;
import com.google.firebase.messaging.AndroidNotification;
import com.google.firebase.messaging.ApnsConfig;
import com.google.firebase.messaging.Aps;
import com.google.firebase.messaging.ApsAlert;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MulticastMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FcmService {

    private final FirebaseMessaging firebaseMessaging;

    public void sendSingleMessage(NotificationSingleRequest singleRequest) {
        try {
            Message message = singleRequest.buildMessage()
                    .setAndroidConfig(getAndroidConfig())
                    .setApnsConfig(getApnsConfig(singleRequest))
                    .build();
            firebaseMessaging.sendAsync(message);
        } catch (RuntimeException e) {
            throw new NeighborsException(FCM_SERVICE_UNAVAILABLE);
        }
    }

    public void sendMultiMessage(NotificationMulticastRequest multicastRequest) {
        try {
            MulticastMessage messages = multicastRequest.buildSendMessage()
                    .setAndroidConfig(getAndroidConfig())
                    .setApnsConfig(getApnsConfig(multicastRequest))
                    .build();
            firebaseMessaging.sendEachForMulticastAsync(messages);
        } catch (RuntimeException e) {
            throw new NeighborsException(FCM_SERVICE_UNAVAILABLE);
        }
    }

    private AndroidConfig getAndroidConfig() {
        return AndroidConfig.builder()
                .setTtl(3600 * 1000)
                .setPriority(Priority.HIGH)
                .setNotification(AndroidNotification.builder()
                        .setClickAction("TOP_STORY__ACTIVITY")
                        .setChannelId("group_buy_channel")
                        .setSound("default")
                        .build())
                .build();
    }

    private ApnsConfig getApnsConfig(NotificationRequest notificationRequest) {
        ApsAlert apsAlert = ApsAlert.builder()
                .setTitle(notificationRequest.title())
                .setBody(notificationRequest.body())
                .build();

        Aps aps = Aps.builder()
                .setAlert(apsAlert)
                .setSound("default")
                .build();

        return ApnsConfig.builder()
                .setAps(aps)
                .build();
    }
}
