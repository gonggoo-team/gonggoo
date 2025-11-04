package com.gonggoo.gonggoo.chat.dto.response;

import java.time.LocalDateTime;

public record MessageResponse(
        int memberId,
        String message,
        LocalDateTime localDateTime
) {
    public static MessageResponse of(int memberId, String message, LocalDateTime localDateTime) {
        return new MessageResponse(memberId, message, localDateTime);
    }
}
