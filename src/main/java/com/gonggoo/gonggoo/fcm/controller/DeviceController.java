package com.gonggoo.gonggoo.fcm.controller;

import com.gonggoo.gonggoo.auth.dto.CustomPrincipal;
import com.gonggoo.gonggoo.fcm.dto.request.DeviceRegistrationRequest;
import com.gonggoo.gonggoo.fcm.service.DeviceService;
import com.gonggoo.gonggoo.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "기기 정보 (Device)", description = "기기 정보 저장/삭제 API 명세")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/device/v1")
public class DeviceController {

    private final DeviceService deviceService;

    @Operation(summary = "기기 등록 및 갱신", description = "사용자의 FCM 토큰을 서버에 등록합니다. 이미 존재하는 토큰이라면 정보를 업데이트합니다.")
    @PostMapping
    public ApiResponse<Void> registerDevice(@AuthenticationPrincipal CustomPrincipal customPrincipal,
                                            @RequestBody DeviceRegistrationRequest request) {
        deviceService.registerDevice(customPrincipal.memberId(), request);
        return ApiResponse.success(HttpStatus.OK, "DEVICE_REGISTER_SUCCESS", null);
    }

    @Operation(summary = "기기 삭제", description = "사용자의 등록된 FCM 토큰을 삭제합니다.")
    @DeleteMapping
    public ApiResponse<Void> unregisterDevice(@RequestBody String fcmToken) {
        deviceService.removeInvalidToken(fcmToken);
        return ApiResponse.success(HttpStatus.NO_CONTENT, "DEVICE_UNREGISTER", null);
    }
}
