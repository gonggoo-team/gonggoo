package com.gonggoo.gonggoo.coopost.domain;

import com.gonggoo.gonggoo.common.domain.BaseEntity;import com.gonggoo.gonggoo.member.domain.Member;
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
@AllArgsConstructor
@Builder
public class CoopostMember extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
//    @Column(name = "apply_id", columnDefinition = "VARCHAR(36)")
    @Column(name = "apply_id")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coopost_id", nullable = false)
    private Coopost coopost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    //레코드 존재 = 신청 상태로 간주
}