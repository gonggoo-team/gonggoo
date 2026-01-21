package com.gonggoo.gonggoo.chat.dto;

import java.util.List;
import java.util.UUID;

public record MessageSendingDto(
        Long chatroomId,
        int memberId,
        String content,
        UUID coopostId,
        String roomCategory,
        List<Integer> memberIds
) { }
