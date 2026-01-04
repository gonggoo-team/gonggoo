package com.gonggoo.gonggoo.chat.domain;

import com.gonggoo.gonggoo.common.domain.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chatroom")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Chatroom extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chatroom_id")
    private Long id;

    @Column(name = "coopost_id", nullable = false)
    private Long coopostId;

    @Column(name = "room_category", nullable = false)
    private String roomCategory;

    @Column(name = "room_ref", nullable = false)
    private String roomRef;

    @OneToMany(mappedBy = "chatroom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatLog> chatLogs = new ArrayList<>();

    @OneToMany(mappedBy = "chatroom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatroomUser> chatroomUsers = new ArrayList<>();

    @Builder
    private Chatroom (Long coopostId, String roomCategory, String roomRef) {
        this.coopostId = coopostId;
        this.roomCategory = roomCategory;
        this.roomRef = roomRef;
    }
}
