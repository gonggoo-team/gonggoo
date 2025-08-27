package com.gonggoo.gonggoo.domain;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
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
@EntityListeners(AbstractMethodError.class)
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
    private com.example.app.domain.CoopostStatus status;

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

    private OffsetDateTime deadlineAt;

    // 인기/조회수 지표
    @Column(nullable = false)
    private long viewCount;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private OffsetDateTime updatedAt;
}

