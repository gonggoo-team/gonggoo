package com.gonggoo.gonggoo.chat.respository.query.projection;

import com.gonggoo.gonggoo.global.exception.NeighborsException;
import com.gonggoo.gonggoo.global.response.ErrorCode;
import java.time.LocalDateTime;

public record Cursor(
        LocalDateTime time,
        long roomId
) {
    public static Cursor parse(String raw) {
        int idx = raw.lastIndexOf(':');
        if (idx <= 0 || idx == raw.length() - 1) {
            throw new NeighborsException(ErrorCode.INVALID_CURSOR);
        }
        LocalDateTime time = LocalDateTime.parse(raw.substring(0, idx));
        long roomId = Long.parseLong(raw.substring(idx + 1));
        return new Cursor(time, roomId);
    }
}
