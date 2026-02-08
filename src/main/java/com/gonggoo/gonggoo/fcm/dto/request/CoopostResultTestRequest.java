package com.gonggoo.gonggoo.fcm.dto.request;

import java.util.List;
import java.util.UUID;

public record CoopostResultTestRequest(
        UUID coopostId,
        List<Integer> memberIds,
        boolean isSuccess
) {
}
