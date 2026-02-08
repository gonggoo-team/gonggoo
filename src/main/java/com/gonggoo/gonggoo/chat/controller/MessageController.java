package com.gonggoo.gonggoo.chat.controller;

import com.gonggoo.gonggoo.chat.dto.request.MessageRequest;
import com.gonggoo.gonggoo.chat.dto.response.MessageResponse;
import com.gonggoo.gonggoo.chat.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Tag(name = "채팅 (Chat)", description = "STOMP 채팅 API 명세")
@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/chat/v1")
public class MessageController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @Operation(summary = "채팅 보내기", description = "구독한 채널에 메시지를 보냅니다.")
    @MessageMapping("/{chatroom-id}")
    public void sendMessage(@DestinationVariable("chatroom-id") Long chatroomId, MessageRequest message) {
        MessageResponse savedMessage = chatService.saveMessage(message.toMessageSendingDto(chatroomId));
        messagingTemplate.convertAndSend("/sub/chat/" + chatroomId, savedMessage);
    }

    @Operation(summary = "첫 메시지 보내기",
            description = "공구 참여자가 첫 메시지를 보냄과 동시에 채팅방이 생성됩니다. 만약 채팅을 보내지 않고 채팅방을 나간다면 채팅방은 생성되지 않습니다.")
    @MessageMapping("/send")
    public void sendMessageResolveRoom(MessageRequest message) {
        MessageResponse savedMessage = chatService.saveMessage(message.toMessageSendingDto(0L));
    }

    @Operation(summary = "채팅 내역 조회")
    @MessageMapping("/{chatroomId}/log")
    public void sendChatLog(@DestinationVariable Long chatroomId,
                                             @Header(name = "cursor", required = false) Long cursor,
                                             Principal principal) {
        List<MessageResponse> chatLogs = chatService.findChatLog(chatroomId, cursor);

        messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/chat/" + chatroomId + "/log",
                chatLogs
        );
    }
}
