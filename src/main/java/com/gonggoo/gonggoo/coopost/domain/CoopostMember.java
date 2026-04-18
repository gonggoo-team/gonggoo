package com.gonggoo.gonggoo.coopost.domain;

import com.gonggoo.gonggoo.global.domain.BaseEntity;import com.gonggoo.gonggoo.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Table(name = "coopost_member",
        indexes = {
                @Index(name = "ix_cm_member", columnList = "member_id"),
                @Index(name = "ix_cm_coopost", columnList = "coopost_id")
        },
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"coopost_id", "member_id"}) // 중복 신청 방지 DB 제약
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CoopostMember extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "apply_id")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coopost_id", nullable = false)
    private Coopost coopost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplyStatus status;

    @Builder
    public CoopostMember(Coopost coopost, Member member, ApplyStatus status) {
        this.coopost = coopost;
        this.member = member;
        this.status = (status != null) ? status : ApplyStatus.ACTIVE;
    }

    // 1. 신청 취소 (Soft Delete)
    public void cancel() {
        this.status = ApplyStatus.CANCELED;
    }

    // 2. 재신청 (취소했다가 다시 신청하는 경우)
    public void reApply() {
        this.status = ApplyStatus.ACTIVE;
    }

    // 3. 상태 확인 편의 메서드
    public boolean isActive() {
        return this.status == ApplyStatus.ACTIVE;
    }

}