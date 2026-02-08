package com.gonggoo.gonggoo.fcm.domain;

import com.gonggoo.gonggoo.member.domain.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "user_device")
@Entity
@Getter
@NoArgsConstructor
public class UserDevice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_device_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "fcm_token", nullable = false, unique = true)
    private String fcmToken;

    @Enumerated(EnumType.STRING)
    @Column(name = "device_type")
    private DeviceType deviceType;

    private LocalDateTime lastLoginAt;

    @Builder
    public UserDevice(Member member, String fcmToken, DeviceType deviceType) {
        this.member = member;
        this.fcmToken = fcmToken;
        this.deviceType = deviceType;
        this.lastLoginAt = LocalDateTime.now();
    }

    public void updateInfo(Member member) {
        this.member = member;
        this.lastLoginAt = LocalDateTime.now();
    }


}
