package com.gonggoo.gonggoo.chat.respository;

import com.gonggoo.gonggoo.chat.domain.Chatroom;
import com.gonggoo.gonggoo.chat.domain.ChatroomUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatroomUserRepository extends JpaRepository<ChatroomUser, Integer> {
    Optional<ChatroomUser> findByChatroomAndMemberId(Chatroom chatroom, int memberId);
}
