package com.gonggoo.gonggoo.scrap.dto.response;

import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.gonggoo.gonggoo.scrap.domain.Scrap;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Value
@Builder
public class ScrapResponse {
    UUID scrapId;
    UUID coopostId;
    String title;
    BigDecimal pricePerUnit;
    Integer currentParticipants;
    Integer maxParticipants;
    CoopostStatus status;
    String location;
    LocalDateTime deadlineAt;
    LocalDateTime scrapedAt; // 스크랩한 날짜

    public static ScrapResponse from(Scrap scrap) {
        Coopost c = scrap.getCoopost();
        return ScrapResponse.builder()
                .scrapId(scrap.getId())
                .coopostId(c.getCoopostId())
                .title(c.getTitle())
                .pricePerUnit(c.getPricePerUnit())
                .currentParticipants(c.getCurrentParticipants())
                .maxParticipants(c.getMaxParticipants())
                .status(c.getStatus())
                .location(c.getLocation())
                .deadlineAt(c.getDeadlineAt())
                .scrapedAt(scrap.getCreatedAt())
                .build();
    }
}