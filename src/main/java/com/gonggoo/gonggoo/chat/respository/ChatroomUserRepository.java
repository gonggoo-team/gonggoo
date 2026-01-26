package com.gonggoo.gonggoo.chat.respository;

import com.gonggoo.gonggoo.chat.domain.Chatroom;
import com.gonggoo.gonggoo.chat.domain.ChatroomUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatroomUserRepository extends JpaRepository<ChatroomUser, Integer> {
    Optional<ChatroomUser> findByChatroomAndMemberId(Chatroom chatroom, int memberId);
    Optional<ChatroomUser> findByChatroom_IdAndMemberId(Long chatroomId, int memberId);
    @Query("select count(u) from ChatroomUser u where u.chatroom.id = :chatroomId and u.leftAt is null")
    long countActiveByChatroomId(@Param("chatroomId") Long chatroomId);
}
