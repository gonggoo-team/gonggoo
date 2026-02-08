package com.gonggoo.gonggoo.fcm.controller;

import com.gonggoo.gonggoo.fcm.dto.request.CoopostResultTestRequest;
import com.gonggoo.gonggoo.fcm.service.NotificationService;
import com.gonggoo.gonggoo.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notification")

@RequiredArgsConstructor
public class NotificationTestController {

    private final NotificationService notificationService;

    @PostMapping("/coopost/result")
    public ApiResponse<String> testCoopostResult(@RequestBody CoopostResultTestRequest request) {
        notificationService.sendCoopostResultNotification(
                request.coopostId(),
                request.memberIds(),
                request.isSuccess()
        );

        return ApiResponse.success(HttpStatus.OK, "공구 결과 알림 전송 요청 성공", null);
    }

}
