package com.gonggoo.gonggoo.fcm.service;

import com.gonggoo.gonggoo.fcm.domain.UserDevice;
import com.gonggoo.gonggoo.fcm.dto.request.DeviceRegistrationRequest;
import com.gonggoo.gonggoo.fcm.repository.MemberDeviceTokenRepository;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import com.gonggoo.gonggoo.global.response.ErrorCode;
import com.gonggoo.gonggoo.member.domain.Member;
import com.gonggoo.gonggoo.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final MemberDeviceTokenRepository memberDeviceTokenRepository;
    private final MemberRepository memberRepository;

    public void registerDevice(Integer memberId, DeviceRegistrationRequest request) {
        Member member = memberRepository.findById(memberId)
                        .orElseThrow(() -> new NeighborsException(ErrorCode.MEMBER_NOT_FOUND));

        memberDeviceTokenRepository.findByFcmToken(request.fcmToken())
                .ifPresentOrElse(
                        device -> device.updateInfo(member),
                        () -> {
                            UserDevice newDevice = UserDevice.builder()
                                    .member(member)
                                    .fcmToken(request.fcmToken())
                                    .deviceType(request.deviceType())
                                    .build();
                            memberDeviceTokenRepository.save(newDevice);
                        }
                );
    }

    public void removeInvalidToken(String token) {
        memberDeviceTokenRepository.deleteByFcmToken(token);
    }
}
