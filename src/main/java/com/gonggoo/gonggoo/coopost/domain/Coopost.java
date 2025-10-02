package com.gonggoo.gonggoo.coopost.domain;

import com.gonggoo.gonggoo.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
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
    @GeneratedValue
    @Column(name = "coopost_id", columnDefinition = "UUID")
    private UUID coopostId;

    @Column(name= "author_id", nullable=false, columnDefinition = "UUID")
    private UUID authorId;

    @Column(nullable = false, length = 120)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CoopostStatus status;

    @Lob
    @Column(nullable = false)
    private String content;


    @Column(name = "price_per_unit", precision = 15, scale = 2)
    private BigDecimal pricePerUnit;

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

}

