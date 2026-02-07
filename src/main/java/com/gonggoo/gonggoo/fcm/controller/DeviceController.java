package com.gonggoo.gonggoo.fcm.controller;

import com.gonggoo.gonggoo.auth.dto.CustomPrincipal;
import com.gonggoo.gonggoo.fcm.dto.request.DeviceRegistrationRequest;
import com.gonggoo.gonggoo.fcm.service.DeviceService;
import com.gonggoo.gonggoo.global.response.ApiResponse;
import com.gonggoo.gonggoo.member.domain.Member;
import com.gonggoo.gonggoo.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/device")
public class DeviceController {

    private final DeviceService deviceService;

    @PostMapping
    public ApiResponse<Void> registerDevice(@AuthenticationPrincipal CustomPrincipal customPrincipal,
                                            @RequestBody DeviceRegistrationRequest request) {
        deviceService.registerDevice(customPrincipal.memberId(), request);
        return ApiResponse.success(HttpStatus.OK, "DEVICE_REGISTER_SUCCESS", null);
    }
}
