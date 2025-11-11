package com.gonggoo.gonggoo.member.dto.request;

import java.time.LocalDateTime;

public record LocationUpdateRequest(
        double latitude,
        double longitude,
        LocalDateTime modifiedAt
) {
}
