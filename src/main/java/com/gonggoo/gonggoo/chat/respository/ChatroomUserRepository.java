package com.gonggoo.gonggoo.chat.respository;

import com.gonggoo.gonggoo.chat.domain.Chatroom;
import com.gonggoo.gonggoo.chat.domain.ChatroomUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatroomUserRepository extends JpaRepository<ChatroomUser, Integer> {
    Optional<ChatroomUser> findByChatroomAndMemberId(Chatroom chatroom, int memberId);
    Optional<ChatroomUser> findByChatroomIdAndMemberId(Long chatroomId, int memberId);
    @Query("select count(u) from chatroom_user u where u.chat")
    long countActiveByChatroomId(@Param("chatroomId") Long chatroomId);
}
