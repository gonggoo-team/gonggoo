package com.gonggoo.gonggoo.chat.dto.request;

import com.gonggoo.gonggoo.chat.dto.MessageSendingDto;
import java.util.List;
import java.util.UUID;

public record MessageRequest(
        int memberId,
        String content,
        UUID coopostId,
        String roomCategory,
        List<Integer> memberIds
) {
    public MessageSendingDto toMessageSendingDto(Long chatroomId) {
        return new MessageSendingDto(
                chatroomId,
                memberId,
                content,
                coopostId,
                roomCategory,
                memberIds
        );
    }
}
