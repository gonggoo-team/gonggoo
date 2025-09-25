package com.gonggoo.gonggoo.coopost.dto.request;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Data
public class CoopostUpdateRequest {
    // Patch: 모두 옵션 (null이면 변경 없음)
    private String title;
    private String content;
    private BigDecimal pricePerUnit;
    private Integer minParticipants;
    private Integer maxParticipants;
    private String category;
    private String location;
    private LocalDateTime deadlineAt;
}