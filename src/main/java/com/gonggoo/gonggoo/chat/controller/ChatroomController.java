package com.gonggoo.gonggoo.chat.controller;

import com.gonggoo.gonggoo.chat.domain.Chatroom;
import com.gonggoo.gonggoo.chat.service.ChatroomService;
import lombok.RequiredArgsConstructor;
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
}
