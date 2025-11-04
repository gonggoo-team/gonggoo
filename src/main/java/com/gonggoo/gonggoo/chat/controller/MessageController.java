package com.gonggoo.gonggoo.chat.controller;

import com.gonggoo.gonggoo.chat.dto.request.MessageRequest;
import com.gonggoo.gonggoo.chat.dto.response.MessageResponse;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class MessageController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.{chatroom-id}")
    public void basic(@DestinationVariable("chatroom-id") int chatroomId, Message<MessageRequest> message) {
        MessageRequest messageRequest = message.getPayload();

        messagingTemplate.convertAndSend("/sub/chat." + chatroomId,
                MessageResponse.of(messageRequest.memberId(), messageRequest.message(), LocalDateTime.now()));
    }
}
