package com.gonggoo.gonggoo.chat.dto.request;

public record MessageRequest(
        int memberId,
        String message
) {
}
