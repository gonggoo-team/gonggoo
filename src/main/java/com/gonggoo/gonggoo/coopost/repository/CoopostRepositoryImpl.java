package com.gonggoo.gonggoo.coopost.repository;

import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.support.PageableExecutionUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static com.gonggoo.gonggoo.coopost.domain.QCoopost.coopost; // QCoopost import

@RequiredArgsConstructor
public class CoopostRepositoryImpl implements CoopostRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Slice<Coopost> search(String keyword, CoopostCategory category, String location,
                                 LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable) {
        List<Coopost> content = queryFactory
                .selectFrom(coopost)
                .where(
                        //삭제되지 않은 글
                        coopost.deletedAt.isNull(),
                        // 커서 조건
                        cursorCondition(createdAtCursor, idCursor),
                        // 검색 조건
                        keywordContains(keyword),
                        categoryEq(category),
                        locationEq(location)
                )
                .orderBy(coopost.createdAt.desc(), coopost.coopostId.desc())
                .limit(pageable.getPageSize() + 1) // Slice 처리를 위해 1개 더 조회
                .fetch();

        return toSlice(content, pageable);
    }

    @Override
    public Slice<Coopost> findMyPosts(UUID authorId, LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable) {
        List<Coopost> content = queryFactory
                .selectFrom(coopost)
                .where(
                        //삭제되지 않은 글
                        coopost.deletedAt.isNull(),
                        // 커서 조건
                        cursorCondition(createdAtCursor, idCursor),
                        // 작성자 ID 조건
                        authorIdEq(authorId)
                )
                .orderBy(coopost.createdAt.desc(), coopost.coopostId.desc())
                .limit(pageable.getPageSize() + 1)
                .fetch();

        return toSlice(content, pageable);
    }

    @Override
    public Slice<Coopost> findPopular(Long viewCountCursor, UUID idCursor, Pageable pageable) {
        List<Coopost> content = queryFactory
                .selectFrom(coopost)
                .where(
                        //삭제되지 않은 글
                        coopost.deletedAt.isNull(),
                        // 인기글 전용 커서 조건
                        popularCursorCondition(viewCountCursor, idCursor)
                )
                .orderBy(coopost.viewCount.desc(), coopost.coopostId.desc())
                .limit(pageable.getPageSize() + 1)
                .fetch();

        return toSlice(content, pageable);
    }

    /**
     * createdAt, coopostId 복합 커서 조건을 생성하는 메서드
     */
    private BooleanExpression cursorCondition(LocalDateTime createdAtCursor, UUID idCursor) {
        if (createdAtCursor == null || idCursor == null) {
            return null; // 첫 페이지 조회 시
        }
        return coopost.createdAt.lt(createdAtCursor)
                .or(coopost.createdAt.eq(createdAtCursor)
                        .and(coopost.coopostId.lt(idCursor)));
    }

    /**
     * viewCount, coopostId 복합 커서 조건을 생성하는 메서드 (인기글용)
     */
    private BooleanExpression popularCursorCondition(Long viewCountCursor, UUID idCursor) {
        if (viewCountCursor == null || idCursor == null) {
            return null; // 첫 페이지 조회 시
        }
        return coopost.viewCount.lt(viewCountCursor)
                .or(coopost.viewCount.eq(viewCountCursor)
                        .and(coopost.coopostId.lt(idCursor)));
    }

    /**
     * 조회 결과를 Slice 객체로 변환하는 헬퍼 메서드
     */
    private <T> Slice<T> toSlice(List<T> content, Pageable pageable) {
        boolean hasNext = false;
        if (content.size() > pageable.getPageSize()) {
            content.remove(pageable.getPageSize());
            hasNext = true;
        }
        return new SliceImpl<>(content, pageable, hasNext);
    }

    // --- 기타 검색 조건 메서드들 ---
    private BooleanExpression authorIdEq(UUID authorId) {
        return authorId != null ? coopost.authorId.eq(authorId) : null;
    }

    private BooleanExpression keywordContains(String keyword) {
        return keyword != null ? coopost.title.containsIgnoreCase(keyword).or(coopost.content.containsIgnoreCase(keyword)) : null;
    }

    private BooleanExpression categoryEq(CoopostCategory category) {
        return category != null ? coopost.category.eq(category) : null;
    }

    private BooleanExpression locationEq(String location) {
        return location != null ? coopost.location.eq(location) : null;
    }
}