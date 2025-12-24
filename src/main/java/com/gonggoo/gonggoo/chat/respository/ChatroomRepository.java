package com.gonggoo.gonggoo.chat.respository;

import com.gonggoo.gonggoo.chat.domain.Chatroom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatroomRepository extends JpaRepository<Chatroom, Long> {
}
