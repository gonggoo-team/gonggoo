package com.gonggoo.gonggoo.chat.respository;

import com.gonggoo.gonggoo.chat.domain.ChatLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatLogRepository extends JpaRepository<ChatLog, Long> {
}
