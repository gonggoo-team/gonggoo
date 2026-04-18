package com.gonggoo.gonggoo.chat.service;

import static com.gonggoo.gonggoo.global.response.ErrorCode.COOPOST_ID_NOT_FOUND;
import static com.gonggoo.gonggoo.global.response.ErrorCode.ROOM_CATEGORY_NOT_FOUND;

import com.gonggoo.gonggoo.chat.domain.ChatLog;
import com.gonggoo.gonggoo.chat.domain.Chatroom;
import com.gonggoo.gonggoo.chat.domain.ChatroomUser;
import com.gonggoo.gonggoo.chat.dto.MessageSendingDto;
import com.gonggoo.gonggoo.chat.dto.response.MessageResponse;
import com.gonggoo.gonggoo.chat.repository.ChatLogRepository;
import com.gonggoo.gonggoo.chat.repository.ChatroomRepository;
import com.gonggoo.gonggoo.chat.repository.ChatroomUserRepository;
import com.gonggoo.gonggoo.global.util.RoomRefHasher;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatService {

    private final ChatLogRepository chatLogRepository;
    private final ChatroomRepository chatroomRepository;
    private final ChatroomUserRepository chatroomUserRepository;

    public MessageResponse saveMessage(MessageSendingDto messageSendingDto) {
        Long chatroomId = messageSendingDto.chatroomId();
        if (chatroomId == null || chatroomId == 0L) {
            Chatroom chatroom = resolveOrCreateChatroom(messageSendingDto);
            chatroomId = chatroom.getId();
        }

        ChatLog savedChatLog = saveChatLog(messageSendingDto);
        return MessageResponse.of(
                savedChatLog.getId(),
                savedChatLog.getMemberId(),
                savedChatLog.getChatroom().getId(),
                savedChatLog.getContent(),
                savedChatLog.getCreatedAt()
        );
    }

    private Chatroom resolveOrCreateChatroom(MessageSendingDto messageSendingDto) {
        validateCoopostIdAndChatroomCategory(messageSendingDto);

        Set<Integer> members = new HashSet<>(Optional.ofNullable(messageSendingDto.memberIds()).orElseGet(List::of));
        members.add(messageSendingDto.memberId());

        String roomRefHash = RoomRefHasher.makeRoomRefHash(messageSendingDto.coopostId(), messageSendingDto.memberIds());
        Optional<Chatroom> existingRoom = chatroomRepository.findActiveBySemanticKey(
                messageSendingDto.coopostId(),
                messageSendingDto.roomCategory(),
                roomRefHash);

        if (existingRoom.isPresent()) {
            upsertParticipants(existingRoom.get(), members);
            return existingRoom.get();
        }

        try {
            Chatroom createdChatroom = chatroomRepository.save(Chatroom.builder()
                    .coopostId(messageSendingDto.coopostId())
                    .roomCategory(messageSendingDto.roomCategory())
                    .roomRef(roomRefHash)
                    .build());

            upsertParticipants(createdChatroom, members);
            return createdChatroom;
        } catch (DataIntegrityViolationException e) {
            return chatroomRepository.findActiveBySemanticKey(
                    messageSendingDto.coopostId(),
                    messageSendingDto.roomCategory(),
                    roomRefHash)
                    .orElseThrow(() -> e);
        }
    }

    private static void validateCoopostIdAndChatroomCategory(MessageSendingDto messageSendingDto) {
        if (messageSendingDto.coopostId() == null) throw new NeighborsException(COOPOST_ID_NOT_FOUND);
        if (messageSendingDto.roomCategory() == null || messageSendingDto.roomCategory().isBlank()) {
            throw new NeighborsException(ROOM_CATEGORY_NOT_FOUND);
        }
    }

    private void upsertParticipants(Chatroom chatroom, Set<Integer> memberIds) {
        for (int memberId : memberIds) {
            chatroomUserRepository.findByChatroomAndMemberId(chatroom, memberId)
                    .ifPresentOrElse(
                            u -> {
                                if (u.getLeftAt() != null) u.rejoinNow();
                            },
                            () -> chatroomUserRepository.save(ChatroomUser.builder()
                                    .chatroom(chatroom)
                                    .memberId(memberId)
                                    .build())
                    );
        }
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
                        chatLog.getChatroom().getId(),
                        chatLog.getContent(),
                        chatLog.getCreatedAt())).toList();
    }
}
