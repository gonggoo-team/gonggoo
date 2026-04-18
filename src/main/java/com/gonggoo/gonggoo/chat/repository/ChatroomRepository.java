package com.gonggoo.gonggoo.chat.repository;

import com.gonggoo.gonggoo.chat.domain.Chatroom;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatroomRepository extends JpaRepository<Chatroom, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select c from Chatroom c
            where c.coopostId = :coopostId
            and c.roomCategory = :roomCategory
            and c.roomRef = : roomRef
            and deletedAt is null
            """)
    Optional<Chatroom> findActiveBySemanticKey(@Param("coopostId") UUID coopostId,
                                            @Param("roomCategory") String roomCategory,
                                            @Param("roomRef") String roomRef);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Chatroom c where c.id = :id")
    Optional<Chatroom> findByIdForUpdate(@Param("id") Long chatroomId);
}
