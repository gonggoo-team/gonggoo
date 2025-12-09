package com.gonggoo.gonggoo.coopost.dto.response;

import com.gonggoo.gonggoo.coopost.domain.ApplyStatus;
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

    // 화면 표시용 상태 메시지 (예: "참여중", "취소됨", "모집완료")
    String displayStatus;
    LocalDateTime appliedAt;

    public static MyApplyResponse from(CoopostMember cm) {
        Coopost c = cm.getCoopost();

        // 상태 조합 로직 호출
        String statusMessage = calculateDisplayStatus(cm.getStatus(), c.getStatus());

        return MyApplyResponse.builder()
                .applyId(cm.getId())
                .coopostId(c.getCoopostId())
                .title(c.getTitle())
                .displayStatus(statusMessage)
                .appliedAt(cm.getCreatedAt())
                .build();
    }

    private static String calculateDisplayStatus(ApplyStatus myStatus, CoopostStatus postStatus) {
        // 1. 내가 취소했으면 무조건 "취소됨"
        if (myStatus == ApplyStatus.CANCELED) {
            return "취소됨";
        }

        // 2. 내가 참여중(ACTIVE)이라면 공구글 상태를 따라감
        switch (postStatus) {
            case OPEN:      return "참여중";
            case CLOSED:    return "모집완료";
            // case COMPLETED: return "거래종료"; (추후 확장 시)
            default:        return "상태미상";
        }
    }
}