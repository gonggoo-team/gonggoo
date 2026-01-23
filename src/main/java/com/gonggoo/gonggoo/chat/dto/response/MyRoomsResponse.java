package com.gonggoo.gonggoo.chat.dto.response;

import com.gonggoo.gonggoo.chat.dto.MyRoomDto;
import java.util.List;

public record MyRoomsResponse(
        List<MyRoomDto> rooms,
        String nextCursor
) {
   public static MyRoomsResponse of(List<MyRoomDto> rooms, String nextCursor) {
       return new MyRoomsResponse(rooms, nextCursor);
   }
}
