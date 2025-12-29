package com.gonggoo.gonggoo.chat.respository;

import com.gonggoo.gonggoo.chat.domain.ChatLog;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatLogRepository extends JpaRepository<ChatLog, Long> {

    List<ChatLog> findTop20ByChatroomIdOrderByIdDesc(Long chatroomId);
    List<ChatLog> findTop20ByChatroomIdAndIdLessThanOrderByDesc(Long chatroomId, Long oldestId);
}
