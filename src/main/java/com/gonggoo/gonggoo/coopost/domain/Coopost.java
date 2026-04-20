package com.gonggoo.gonggoo.coopost.domain;

import com.gonggoo.gonggoo.global.domain.BaseEntity;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostUpdateRequest;
import com.gonggoo.gonggoo.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Coopost extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "coopost_id")
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private UUID coopostId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private Member member;

    @Column(nullable = false, length = 120)
    private String title;

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

    // 생성자 (Builder 사용)
    @Builder
    public Coopost(Member member, String title, String content, CoopostStatus status, BigDecimal pricePerUnit, BigDecimal originalPrice, Integer minParticipants, Integer maxParticipants, Integer currentParticipants, CoopostCategory category, String location, LocalDateTime deadlineAt, long viewCount) {
        this.member = member;
        this.title = title;
        this.content = content;
        this.status = status;
        this.pricePerUnit = pricePerUnit;
        this.originalPrice = originalPrice;
        this.minParticipants = minParticipants;
        this.maxParticipants = maxParticipants;
        this.currentParticipants = currentParticipants;
        this.category = category;
        this.location = location;
        this.deadlineAt = deadlineAt;
        this.viewCount = viewCount;
    }

    // 1. 게시글 정보 수정
    public void updateInfo(CoopostUpdateRequest req) {
        // null이 아닌 값만 업데이트 (Patch 방식)
        if (req.getTitle() != null) this.title = req.getTitle();
        if (req.getContent() != null) this.content = req.getContent();
        if (req.getPricePerUnit() != null) this.pricePerUnit = req.getPricePerUnit();
        if (req.getOriginalPrice() != null) this.originalPrice = req.getOriginalPrice();
        if (req.getMinParticipants() != null) this.minParticipants = req.getMinParticipants();
        if (req.getMaxParticipants() != null) this.maxParticipants = req.getMaxParticipants();
        if (req.getCategory() != null) this.category = req.getCategory();
        if (req.getLocation() != null) this.location = req.getLocation();
        if (req.getDeadlineAt() != null) this.deadlineAt = req.getDeadlineAt();
    }

    // 2. 상태 변경
    public void changeStatus(CoopostStatus newStatus) {
        this.status = newStatus;
    }

    // 3. 조회수 증가
    public void increaseViewCount() {
        this.viewCount++;
    }

    public void addParticipant() {
        if (this.currentParticipants >= this.maxParticipants) {
            throw new IllegalStateException("모집 인원이 초과되었습니다."); // 도메인 레벨 방어
        }
        this.currentParticipants++;

        // 인원이 꽉 차면 자동으로 CLOSED 처리
        if (this.currentParticipants.equals(this.maxParticipants)) {
            this.status = CoopostStatus.CLOSED;
        }
    }

    public void removeParticipant() {
        if (this.currentParticipants > 0) {
            this.currentParticipants--;
        }
        // CLOSED 상태였는데 자리가 생기면 OPEN으로 변경
        if (this.status == CoopostStatus.CLOSED && this.currentParticipants < this.maxParticipants) {
            this.status = CoopostStatus.OPEN;
        }
    }

    public void softDelete() {
        softDeleteNow();
    }

}

