package com.gonggoo.gonggoo.chat.service;

import com.gonggoo.gonggoo.chat.domain.ChatLog;
import com.gonggoo.gonggoo.chat.domain.Chatroom;
import com.gonggoo.gonggoo.chat.dto.MessageSendingDto;
import com.gonggoo.gonggoo.chat.dto.response.MessageResponse;
import com.gonggoo.gonggoo.chat.respository.ChatLogRepository;
import com.gonggoo.gonggoo.chat.respository.ChatroomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatService {

    private final ChatLogRepository chatLogRepository;
    private final ChatroomRepository chatroomRepository;

    public MessageResponse saveMessage(MessageSendingDto messageSendingDto) {
        ChatLog savedChatLog = saveChatLog(messageSendingDto);
        return MessageResponse.of(
                savedChatLog.getId(),
                savedChatLog.getMemberId(),
                savedChatLog.getContent(),
                savedChatLog.getCreatedAt()
        );
    }

    private ChatLog saveChatLog(MessageSendingDto messageSendingDto) {
        return chatLogRepository.save(toChatLog(messageSendingDto));
    }

    @Transactional
    public ChatLog toChatLog(MessageSendingDto messageSendingDto) {
        Chatroom chatroom = chatroomRepository.getReferenceById(messageSendingDto.chatroomId());

        return ChatLog.builder()
                .chatroom(chatroom)
                .memberId(messageSendingDto.memberId())
                .content(messageSendingDto.content())
                .build();
    }
}
