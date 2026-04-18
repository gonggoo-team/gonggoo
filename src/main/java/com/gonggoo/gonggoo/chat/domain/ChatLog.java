package com.gonggoo.gonggoo.chat.domain;

import com.gonggoo.gonggoo.global.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chat_log")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_log_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatroom_id", nullable = false)
    private Chatroom chatroom;

    @Column(name = "member_id", nullable = false)
    private int memberId;

    private String content;

    @Builder
    private ChatLog(Chatroom chatroom, int memberId, String content) {
        this.chatroom = chatroom;
        this.memberId = memberId;
        this.content = content;
    }
}
