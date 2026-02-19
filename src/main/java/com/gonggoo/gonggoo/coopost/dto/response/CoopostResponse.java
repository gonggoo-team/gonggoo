package com.gonggoo.gonggoo.coopost.dto.response;
import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.gonggoo.gonggoo.coopost.domain.Coopost;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Value
@Builder
public class CoopostResponse {
    UUID coopostId;
    int authorId;
    String title;
    String content;
    CoopostStatus status;

    BigDecimal pricePerUnit;
    BigDecimal originalPrice;
    Integer minParticipants;
    Integer maxParticipants;
    Integer currentParticipants;
    CoopostCategory category;
    String location;
    LocalDateTime deadlineAt;

    long viewCount;
    LocalDateTime createdAt;
    LocalDateTime modifiedAt;

    //참여에 필요함
    boolean isApplied;   // 신청 여부 (true: 이미 신청함)
    UUID myApplyId;      // 신청했다면 그 신청 내역의 ID (취소할 때 사용)

    // 기존 from 메서드는 "로그인 안 한 상태" 혹은 "목록 조회"용으로 사용 (기본값 false, null)
    public static CoopostResponse from(Coopost e) {
        return from(e, false, null);
    }

    // 상세 조회용 오버로딩 메서드
    public static CoopostResponse from(Coopost e, boolean isApplied, UUID myApplyId) {
        return CoopostResponse.builder()
                .coopostId(e.getCoopostId())
                .authorId(e.getMember().getId())
                .title(e.getTitle())
                .content(e.getContent())
                .status(e.getStatus())
                .originalPrice(e.getOriginalPrice())
                .pricePerUnit(e.getPricePerUnit())
                .minParticipants(e.getMinParticipants())
                .maxParticipants(e.getMaxParticipants())
                .currentParticipants(e.getCurrentParticipants())
                .category(e.getCategory())
                .location(e.getLocation())
                .deadlineAt(e.getDeadlineAt())
                .viewCount(e.getViewCount())
                .createdAt(e.getCreatedAt())
                .modifiedAt(e.getModifiedAt())
                .isApplied(isApplied)  // 추가됨
                .myApplyId(myApplyId)  // 추가됨
                .build();
    }
}