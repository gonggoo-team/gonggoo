package com.gonggoo.gonggoo.chat.controller;

import com.gonggoo.gonggoo.auth.dto.CustomPrincipal;
import com.gonggoo.gonggoo.chat.domain.Chatroom;
import com.gonggoo.gonggoo.chat.dto.response.MyRoomsResponse;
import com.gonggoo.gonggoo.chat.service.ChatroomService;
import com.gonggoo.gonggoo.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "채팅방 (Chatroom)", description = "채팅방 API 명세")
@RestController
@RequestMapping("/api/chatroom/v1")
@RequiredArgsConstructor
public class ChatroomController {

    private final ChatroomService chatroomService;

    @Operation(summary = "채팅방 나가기", description = "사용자가 채팅방을 나갑니다.")
    @PostMapping("/{chatroomId}/leave")
    public void leave(@PathVariable Long chatroomId, @RequestParam int memberId) {
        chatroomService.leave(chatroomId, memberId);
    }

    @Operation(summary = "내 채팅방 목록 불러오기", description = "현재 내가 참여하고 있는 채팅방을 20개씩 불러옵니다.")
    @GetMapping("/myRooms")
    public ApiResponse<MyRoomsResponse> myRooms(
            @AuthenticationPrincipal CustomPrincipal customPrincipal,
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success("GETTING_CHATROOM_SUCCESS", chatroomService.listMyActiveRooms(
                customPrincipal.memberId(), cursor, size));
    }
}
