package com.gonggoo.gonggoo.coopost.domain;

import com.gonggoo.gonggoo.common.domain.BaseEntity;
import com.gonggoo.gonggoo.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "coopost",
        indexes = {
                @Index(name = "ix_coopost_title", columnList = "title"),
                @Index(name = "ix_coopost_status", columnList = "status"),
                @Index(name = "ix_coopost_author", columnList = "author_id"),
                @Index(name = "ix_coopost_category", columnList = "category")
        }
)
@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
public class Coopost extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
//    @Column(name = "coopost_id", columnDefinition = "VARCHAR(36)")
    @Column(name = "coopost_id")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID coopostId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private Member member;

    @Column(nullable = false, length = 120)
    private String title;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CoopostStatus status;


    @Column(nullable = false, length = 2000)
    private String content;


    @Column(name = "price_per_unit", precision = 15, scale = 2)
    private BigDecimal pricePerUnit;

    //할인율 계산을 위한 정가 추가
    @Column(name="original_price", precision = 15, scale = 2)
    private BigDecimal originalPrice;

    @Column(name = "min_participants")
    private Integer minParticipants;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Column(name = "current_participants")
    private Integer currentParticipants;

    @Enumerated(EnumType.STRING) // DB에 "FOOD", "ELSE" 같은 문자열로 저장
    @Column(nullable = false, length = 30) // 길이를 enum 상수에 맞게 조절
    private CoopostCategory category;


    @Column(length = 120)
    private String location;

    @Column(name = "deadline_at", nullable = false)
    private LocalDateTime deadlineAt;

    // 인기/조회수 지표
    @Column(nullable = false)
    private long viewCount;


    public void setDeletedAt(LocalDateTime now) {
        this.deletedAt = now;
    }

}

