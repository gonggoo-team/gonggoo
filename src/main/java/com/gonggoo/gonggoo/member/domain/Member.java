package com.gonggoo.gonggoo.member.domain;

import com.gonggoo.gonggoo.common.domain.BaseEntity;
import com.gonggoo.gonggoo.common.domain.GeoLocation;
import com.gonggoo.gonggoo.common.domain.Role;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "member")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private int id;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column
    private String profileImage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Embedded
    private GeoLocation location;

    @Builder
    public Member(String nickname, String phoneNumber, String email, String password, String profileImage, Role role, GeoLocation location) {
        this.nickname = nickname;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.password = password;
        this.profileImage = "/images/default.png";
        this.role = Role.USER;
        this.location = location;
    }
}
