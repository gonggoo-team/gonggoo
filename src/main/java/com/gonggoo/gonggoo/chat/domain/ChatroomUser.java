package com.gonggoo.gonggoo.chat.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chatroom_user")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatroomUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chatroom_user_id")
    private int chatroomUserId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatroom_id", nullable = false)
    private Chatroom chatroom;

    @Column(name = "member_id", nullable = false)
    private int memberId;

    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt;

    @Column(name = "left_at")
    private LocalDateTime leftAt;

    @Builder
    private ChatroomUser (Chatroom chatroom, int memberId) {
        this.chatroom = chatroom;
        this.memberId = memberId;
        this.joinedAt = LocalDateTime.now();
    }
}
