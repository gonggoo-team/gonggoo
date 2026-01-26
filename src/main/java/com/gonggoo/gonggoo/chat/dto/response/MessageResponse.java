package com.gonggoo.gonggoo.chat.dto.response;

import java.time.LocalDateTime;

public record MessageResponse(
        Long id,
        int memberId,
        Long chatroomId,
        String message,
        LocalDateTime localDateTime
) {
    public static MessageResponse of(Long id, int memberId, Long chatroomId, String message, LocalDateTime localDateTime) {
        return new MessageResponse(id, memberId, chatroomId, message, localDateTime);
    }
}
