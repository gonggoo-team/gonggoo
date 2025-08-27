package com.gonggoo.gonggoo.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
public class CoopostCreateRequest {
    // 임시로 헤더 대신 바디로 authorId 받도록 (JWT 붙이면 제거)
    private UUID authorId;

    private String title;
    private String content;
    private BigDecimal pricePerUnit;
    private Integer minParticipants;
    private Integer maxParticipants;
    private String category;
    private String location;
    private OffsetDateTime deadlineAt;
}