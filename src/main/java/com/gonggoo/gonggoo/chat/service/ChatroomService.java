package com.gonggoo.gonggoo.chat.service;

import static com.gonggoo.gonggoo.global.response.ErrorCode.*;

import com.gonggoo.gonggoo.chat.domain.Chatroom;
import com.gonggoo.gonggoo.chat.domain.ChatroomUser;
import com.gonggoo.gonggoo.chat.respository.ChatroomRepository;
import com.gonggoo.gonggoo.chat.respository.ChatroomUserRepository;
import com.gonggoo.gonggoo.common.util.RoomRefHasher;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import com.gonggoo.gonggoo.global.response.ErrorCode;
import jakarta.transaction.Transactional;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatroomService {

    private final ChatroomRepository chatroomRepository;
    private final ChatroomUserRepository chatroomUserRepository;

    @Transactional
    public Chatroom resolveOrCreateActiveRoom(UUID coopostId, String roomCategory, List<Integer> memberIds, Integer senderId) {
        validateRoomCategoryAndSenderID(roomCategory, senderId);

        Set<Integer> set = new HashSet<>(Optional.ofNullable(memberIds).orElseGet(List::of));
        set.add(senderId);

        String roomRefHash = RoomRefHasher.makeRoomRefHash(coopostId,memberIds);

        Optional<Chatroom> existingRoom = chatroomRepository.findActiveBySemanticKey(coopostId, roomCategory, roomRefHash);
        if (existingRoom.isPresent()) return existingRoom.get();

        try {
            Chatroom createdChatroom = chatroomRepository.save(Chatroom.builder()
                    .coopostId(coopostId)
                    .roomCategory(roomCategory)
                    .roomRef(roomRefHash)
                    .build());

            upsertParticipants(createdChatroom, set);

            return createdChatroom;
        } catch (DataIntegrityViolationException e) {
            return chatroomRepository.findActiveBySemanticKey(coopostId, roomCategory, roomRefHash)
                    .orElseThrow(() -> e);
        }
    }

    private void validateRoomCategoryAndSenderID(String roomCategory, Integer senderId) {
        if (senderId == null) throw new NeighborsException(SENDER_ID_NOT_FOUND);
        if (roomCategory == null || roomCategory.isBlank()) throw new NeighborsException(ROOM_CATEGORY_NOT_FOUND);
    }

    @Transactional
    public void upsertParticipants(Chatroom chatroom, Collection<Integer> memberIds) {
        for (int memberId : memberIds) {
            chatroomUserRepository.findByChatroomAndMemberId(chatroom, memberId)
                    .ifPresentOrElse(
                            ChatroomUser::rejoinNow,
                            () -> chatroomUserRepository.save(ChatroomUser.builder()
                                    .chatroom(chatroom)
                                    .memberId(memberId)
                                    .build())
                    );
        }
    }

    @Transactional
    public void leave(Long chatroomId, int memberId) {
        Chatroom room = chatroomRepository.findByIdForUpdate(chatroomId)
                .orElseThrow(() -> new NeighborsException(CHATROOM_NOT_FOUND));

        if (room.isDeleted()) return;

        ChatroomUser user = chatroomUserRepository.findByChatroomIdAndMemberId(chatroomId, memberId)
                .orElseThrow(() -> new NeighborsException(CHATROOM_USER_NOT_FOUND));

        if (user.isActive()) return;
        user.markLeftNow();

        long count = chatroomUserRepository.countActiveByChatroomId(chatroomId);
        if (count == 0) {
            room.softDeleteNow();
        }
    }
}
