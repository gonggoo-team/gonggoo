package com.gonggoo.gonggoo.fcm.dto.request;

import com.gonggoo.gonggoo.fcm.domain.DeviceType;

public record DeviceRegistrationRequest(
        String fcmToken,
        DeviceType deviceType
) {
}
