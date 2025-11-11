package com.gonggoo.gonggoo.member.dto.response;

import com.gonggoo.gonggoo.common.domain.GeoLocation;
import java.time.LocalDateTime;

public record LocationResponse(
        double latitude,
        double longitude,
        LocalDateTime modifiedAt
) {
    public static LocationResponse of(GeoLocation location, LocalDateTime modifiedAt) {
        return new LocationResponse(location.getLatitude(), location.getLongitude(), modifiedAt);
    }
}
