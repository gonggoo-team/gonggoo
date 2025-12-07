package com.gonggoo.gonggoo.coopost.dto.response;

import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.domain.CoopostMember;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;
import java.util.UUID;

@Value
@Builder
public class MyApplyResponse {
    UUID applyId;
    UUID coopostId;
    String title;
    CoopostStatus status;
    LocalDateTime appliedAt; // 신청 일시

    public static MyApplyResponse from(CoopostMember cm) {
        Coopost c = cm.getCoopost();
        return MyApplyResponse.builder()
                .applyId(cm.getId())
                .coopostId(c.getCoopostId())
                .title(c.getTitle())
                .status(c.getStatus())
                .appliedAt(cm.getCreatedAt())
                .build();
    }
}