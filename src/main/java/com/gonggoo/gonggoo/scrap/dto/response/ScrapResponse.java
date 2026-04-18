package com.gonggoo.gonggoo.scrap.dto.response;

import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.gonggoo.gonggoo.scrap.domain.Scrap;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;


public record ScrapResponse(
        UUID scrapId,
        UUID coopostId,
        String title,
        BigDecimal pricePerUnit,
        Integer currentParticipants,
        Integer maxParticipants,
        CoopostStatus status,
        String location,
        LocalDateTime deadlineAt,
        LocalDateTime scrapedAt
) {
    // Static Factory Method로 변환 로직 유지
    public static ScrapResponse from(Scrap scrap) {
        Coopost c = scrap.getCoopost();
        return new ScrapResponse(
                scrap.getId(),
                c.getCoopostId(),
                c.getTitle(),
                c.getPricePerUnit(),
                c.getCurrentParticipants(),
                c.getMaxParticipants(),
                c.getStatus(),
                c.getLocation(),
                c.getDeadlineAt(),
                scrap.getCreatedAt()
        );
    }
}