package com.gonggoo.gonggoo.chat.controller;

import com.gonggoo.gonggoo.chat.dto.request.MessageRequest;
import com.gonggoo.gonggoo.chat.dto.response.MessageResponse;
import com.gonggoo.gonggoo.chat.service.ChatService;
import jakarta.annotation.Nullable;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class MessageController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{chatroom-id}")
    public void sendMessage(@DestinationVariable("chatroom-id") Long chatroomId, MessageRequest message) {
        MessageResponse savedMessage = chatService.saveMessage(message.toMessageSendingDto(chatroomId));
        messagingTemplate.convertAndSend("/sub/chat/" + chatroomId, savedMessage);
    }

    @MessageMapping("/chat/{chatroom-id}/log")
    @SendToUser("/queue/chat/log")
    public List<MessageResponse> sendChatLog(@DestinationVariable("chatroom-id") Long chatroomId,
                                             @Header(name = "cursor", required = false) Long cursor) {
        return chatService.findChatLog(chatroomId, cursor);
    }
}
