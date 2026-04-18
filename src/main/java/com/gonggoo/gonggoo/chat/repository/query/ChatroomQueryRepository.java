package com.gonggoo.gonggoo.chat.repository.query;

import com.gonggoo.gonggoo.chat.domain.Chatroom;
import com.gonggoo.gonggoo.chat.repository.query.projection.MyActiveRoomRow;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatroomQueryRepository extends JpaRepository<Chatroom, Long> {

    @Query(value = """
            select 
                c.chatroomId as chatroomId,
                c.coopostId as coopostId,
                c.roomCategory as roomCategory,
                c.roomRef as roomRef,
                cl.content as lastMessage,
                cl.createdAt as lastMessageAt
            from ChatroomUser cu
            join Chatroom c
            on c.chatroomId = cu.chatroomId
            and c.deletedAt is null
            left join lateral (
                select cl2.content, cl2.createdAt
                from ChatLog cl2
                where cl2.chatroomId = c.chatroomId
                order by cl2.createdAt desc, cl2.chatLogId desc
                limit 1
            ) cl on true
            where cu.memberId = :memberId
            and cu.leftAt is null
            order by cl.createdAt desc nulls last, c.chatroomId desc
            limit :size
            """, nativeQuery = true)
    List<MyActiveRoomRow> findMyActiveRooms(@Param("memberId") int memberId,
                                            @Param("size") int size);


    @Query(value = """
            select
                c.chatroomId as chatroomId,
                c.coopostId as coopostId,
                c.roomCategory as roomCategory,
                c.roomRef as roomRef,
                cl.content as lastMessage,
                cl.createdAt as lastMessageAt
            from ChatroomUser cu
            join Chatroom c
            on c.chatroomId = cu.chatroomId
            and c.deletedAt is null
            left join lateral (
                select cl2.content, cl2.createdAt
                from ChatLog cl2
                where cl2.chatroomId = c.chatroomId
                order by cl2.createdAt desc, cl2.chatLogId desc
                limit 1
            ) cl on true
            where cu.memberId = :memberId
            and cu.leftAt is null
            and (
                (cl.createdAt < :cursorTime)
                or (cl.createdAt = :cursorTime and c.chatroomId < :cursorRoomId)
            )
            order by cl.createdAt desc nulls last, c.chatroomId desc
            limit :size
            """, nativeQuery = true)
    List<MyActiveRoomRow> findMyActiveRoomsAfterCursor(@Param("memberId") int memberId,
                                                       @Param("cursorTime")LocalDateTime cursorTime,
                                                       @Param("cursorRoomId") long cursorRoomId,
                                                       @Param("size") int size);
}
