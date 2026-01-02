package com.gonggoo.gonggoo.chat.dto.request;

import com.gonggoo.gonggoo.chat.dto.MessageSendingDto;

public record MessageRequest(
        int memberId,
        String content
) {
    public MessageSendingDto toMessageSendingDto(Long chatroomId) {
        return new MessageSendingDto(
                chatroomId,
                memberId,
                content
        );
    }
}
