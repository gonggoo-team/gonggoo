package com.gonggoo.gonggoo.domain;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.cglib.core.Local;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
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
@EntityListeners(AuditingEntityListener.class) // 생성 수정 시간 자동 기록 메서드
@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
public class Coopost {

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
    private com.gonggoo.gonggoo.domain.CoopostStatus status;

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

    @Column(length = 50)
    private String category;

    @Column(length = 120)
    private String location;

    @Column(name = "deadline_at", nullable = false)
    private LocalDateTime deadlineAt;

    // 인기/조회수 지표
    @Column(nullable = false)
    private long viewCount;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}

