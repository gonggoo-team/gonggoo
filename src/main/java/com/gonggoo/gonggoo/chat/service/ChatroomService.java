package com.gonggoo.gonggoo.chat.service;

import static com.gonggoo.gonggoo.global.response.ErrorCode.CHATROOM_NOT_FOUND;
import static com.gonggoo.gonggoo.global.response.ErrorCode.CHATROOM_USER_NOT_FOUND;
import static com.gonggoo.gonggoo.global.response.ErrorCode.ROOM_CATEGORY_NOT_FOUND;
import static com.gonggoo.gonggoo.global.response.ErrorCode.SENDER_ID_NOT_FOUND;

import com.gonggoo.gonggoo.chat.domain.Chatroom;
import com.gonggoo.gonggoo.chat.domain.ChatroomUser;
import com.gonggoo.gonggoo.chat.dto.MyRoomDto;
import com.gonggoo.gonggoo.chat.dto.response.MyRoomsResponse;
import com.gonggoo.gonggoo.chat.respository.ChatroomRepository;
import com.gonggoo.gonggoo.chat.respository.ChatroomUserRepository;
import com.gonggoo.gonggoo.chat.respository.query.ChatroomQueryRepository;
import com.gonggoo.gonggoo.chat.respository.query.projection.Cursor;
import com.gonggoo.gonggoo.chat.respository.query.projection.MyActiveRoomRow;
import com.gonggoo.gonggoo.common.util.RoomRefHasher;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
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
    private final ChatroomQueryRepository chatroomQueryRepository;

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

        ChatroomUser user = chatroomUserRepository.findByChatroom_IdAndMemberId(chatroomId, memberId)
                .orElseThrow(() -> new NeighborsException(CHATROOM_USER_NOT_FOUND));

        if (user.isActive()) return;
        user.markLeftNow();

        long count = chatroomUserRepository.countActiveByChatroomId(chatroomId);
        if (count == 0) {
            room.softDeleteNow();
        }
    }

    public MyRoomsResponse listMyActiveRooms(int memberId, String cursor, int size) {
        int pageSize = Math.min(Math.max(size, 1), 50);

        List<MyActiveRoomRow> rows;
        if (cursor == null || cursor.isBlank()) {
            rows = chatroomQueryRepository.findMyActiveRooms(memberId, pageSize);
        } else {
            Cursor c = Cursor.parse(cursor);
            rows = chatroomQueryRepository.findMyActiveRoomsAfterCursor(memberId, c.time(), c.roomId(), pageSize);
        }

        List<MyRoomDto> rooms = rows.stream().map(r -> MyRoomDto.builder()
                .chatroomId(r.getChatroomId())
                .coopostId(r.getCoopostId())
                .roomCategory(r.getRoomCategory())
                .roomRef(r.getRoomRef())
                .lastMessage(r.getLastMessage())
                .lastMessageAt(r.getLastMessageAt())
                .build()).toList();

        String nextCursor = null;
        if (!rooms.isEmpty()) {
            MyRoomDto last = rooms.get(rooms.size() - 1);
            LocalDateTime time = last.getLastMessageAt() != null ? last.getLastMessageAt() : LocalDateTime.of(1970,1,1,0,0);
            nextCursor = time.toString() + ":" + last.getChatroomId();
        }

        return MyRoomsResponse.of(
                rooms,
                nextCursor
        );
    }
}
