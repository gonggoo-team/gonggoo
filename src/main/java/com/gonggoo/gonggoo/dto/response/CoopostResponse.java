package com.gonggoo.gonggoo.dto.response;
import com.gonggoo.gonggoo.domain.Coopost;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Value
@Builder
public class CoopostResponse {
    UUID coopostId;
    UUID authorId;
    String title;
    String content;
    com.example.app.domain.CoopostStatus status;

    BigDecimal pricePerUnit;
    Integer minParticipants;
    Integer maxParticipants;
    Integer currentParticipants;
    String category;
    String location;
    OffsetDateTime deadlineAt;

    long viewCount;
    OffsetDateTime createdAt;
    OffsetDateTime updatedAt;

    public static CoopostResponse from(Coopost e) {
        return CoopostResponse.builder()
                .coopostId(e.getCoopostId())
                .authorId(e.getAuthorId())
                .title(e.getTitle())
                .content(e.getContent())
                .status(e.getStatus())
                .pricePerUnit(e.getPricePerUnit())
                .minParticipants(e.getMinParticipants())
                .maxParticipants(e.getMaxParticipants())
                .currentParticipants(e.getCurrentParticipants())
                .category(e.getCategory())
                .location(e.getLocation())
                .deadlineAt(e.getDeadlineAt())
                .viewCount(e.getViewCount())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}