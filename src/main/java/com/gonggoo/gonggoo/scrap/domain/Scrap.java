package com.gonggoo.gonggoo.scrap.domain;

import com.gonggoo.gonggoo.global.domain.BaseEntity;
import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.member.domain.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

@Entity
@Table(name = "scrap",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"member_id", "coopost_id"}) // 중복 스크랩 방지
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Scrap extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "scrap_id")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coopost_id", nullable = false)
    private Coopost coopost;

    @Builder
    public Scrap(Member member, Coopost coopost) {
        this.member = member;
        this.coopost = coopost;
    }
}