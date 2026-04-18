package com.gonggoo.gonggoo.chat.repository.query.projection;

import java.time.LocalDateTime;
import java.util.UUID;

public interface MyActiveRoomRow {
    Long getChatroomId();
    UUID getCoopostId();
    String getRoomCategory();
    String getRoomRef();
    String getLastMessage();
    LocalDateTime getLastMessageAt();
}
