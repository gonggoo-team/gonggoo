package com.gonggoo.gonggoo.fcm.service;

import com.gonggoo.gonggoo.fcm.dto.request.NotificationMulticastRequest;
import com.gonggoo.gonggoo.fcm.repository.MemberDeviceTokenRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final MemberDeviceTokenRepository memberDeviceTokenRepository;
    private final FcmService fcmService;

    @Transactional(readOnly = true)
    public void sendCoopostResultNotification(UUID coopostId, List<Integer>memberIds, boolean isSuccess) {
        List<String> tokens = memberDeviceTokenRepository.findAllTokensByMemberIds(memberIds);

        String title = isSuccess ? "공구 성공! 결제 진행 요청" : "공구 무산 안내";
        String body = isSuccess ? "목표 인원이 달성되었습니다! 지금 바로 결제해주세요!" : "아쉽게도 인원이 모이지 않아 공구가 취소되었습니다.";

        Map<String, String> data = new HashMap<>();
        data.put("type", "GROUP_BUY_RESULT");
        data.put("groupBuyId", String.valueOf(coopostId));
        data.put("isSuccess", String.valueOf(isSuccess));

        NotificationMulticastRequest request = new NotificationMulticastRequest(tokens, title, body, data);
        fcmService.sendMultiMessage(request);
    }
}
