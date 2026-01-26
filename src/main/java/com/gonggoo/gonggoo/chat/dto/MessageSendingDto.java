package com.gonggoo.gonggoo.chat.dto;

public record MessageSendingDto(
        Long chatroomId,
        int memberId,
        String content
) { }
