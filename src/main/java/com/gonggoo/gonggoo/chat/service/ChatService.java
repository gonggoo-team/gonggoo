package com.gonggoo.gonggoo.chat.service;

import com.gonggoo.gonggoo.chat.domain.ChatLog;
import com.gonggoo.gonggoo.chat.domain.Chatroom;
import com.gonggoo.gonggoo.chat.dto.MessageSendingDto;
import com.gonggoo.gonggoo.chat.dto.response.MessageResponse;
import com.gonggoo.gonggoo.chat.respository.ChatLogRepository;
import com.gonggoo.gonggoo.chat.respository.ChatroomRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.aspectj.bridge.Message;
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

    @Transactional(readOnly = true)
    public List<MessageResponse> findChatLog(Long chatroomId, Long cursor) {
        List<ChatLog> chatLogs = cursor == null
                ? chatLogRepository.findTop20ByChatroomIdOrderByIdDesc(chatroomId)//cursor가 null 이면 최초 접속
                : chatLogRepository.findTop20ByChatroomIdAndIdLessThanOrderByIdDesc(chatroomId, cursor);//cursor가 null이 아니면 커서값 기반 페이지네이션

        return chatLogs.stream().map(
                chatLog -> MessageResponse.of(
                        chatLog.getId(),
                        chatLog.getMemberId(),
                        chatLog.getContent(),
                        chatLog.getCreatedAt())).toList();
    }
}
