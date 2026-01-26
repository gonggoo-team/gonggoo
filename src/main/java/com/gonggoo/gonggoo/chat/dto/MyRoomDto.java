package com.gonggoo.gonggoo.chat.dto;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MyRoomDto {
    Long chatroomId;
    UUID coopostId;
    String roomCategory;
    String roomRef;
    String lastMessage;
    LocalDateTime lastMessageAt;
}

