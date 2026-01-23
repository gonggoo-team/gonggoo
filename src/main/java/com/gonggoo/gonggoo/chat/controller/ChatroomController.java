package com.gonggoo.gonggoo.chat.controller;

import com.gonggoo.gonggoo.auth.dto.CustomPrincipal;
import com.gonggoo.gonggoo.chat.domain.Chatroom;
import com.gonggoo.gonggoo.chat.dto.response.MyRoomsResponse;
import com.gonggoo.gonggoo.chat.service.ChatroomService;
import com.gonggoo.gonggoo.global.response.ApiResponse;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatroom/v1")
@RequiredArgsConstructor
public class ChatroomController {

    private final ChatroomService chatroomService;

    @PostMapping("/{chatroomId}/leave")
    public void leave(@PathVariable Long chatroomId, @RequestParam int memberId) {
        chatroomService.leave(chatroomId, memberId);
    }

    @GetMapping("/myRooms")
    public ApiResponse<MyRoomsResponse> myRooms(
            @AuthenticationPrincipal CustomPrincipal customPrincipal,
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("GETTING_CHATROOM_SUCCESS", chatroomService.listMyActiveRooms(
                customPrincipal.memberId(), cursor, size));
    }
}
