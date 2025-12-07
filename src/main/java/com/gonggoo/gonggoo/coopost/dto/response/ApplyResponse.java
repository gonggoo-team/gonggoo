package com.gonggoo.gonggoo.coopost.dto.response;

import lombok.Builder;
import lombok.Value;
import java.util.UUID;

@Value
@Builder
public class ApplyResponse {
    UUID applyId;      // 신청 고유 ID
    UUID coopostId;
    int currentParticipants; // 갱신된 현재 인원
    String message;
}