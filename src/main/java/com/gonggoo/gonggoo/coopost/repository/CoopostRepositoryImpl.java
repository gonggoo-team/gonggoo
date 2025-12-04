package com.gonggoo.gonggoo.coopost.repository;

import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostSearchCondition;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
    public Slice<Coopost> findMyPosts(int authorId, LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable) {
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

    @Override
    public Coopost getByIdWithLock(UUID coopostId) {
        return queryFactory
                .selectFrom(coopost)
                .where(coopost.coopostId.eq(coopostId))
                .setLockMode(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
                .fetchOne();
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


    //추가 필터 메서드
    @Override
    public Slice<Coopost> searchByCondition(CoopostSearchCondition cond, Object cursorValue, UUID cursorId, Pageable pageable) {


        List<Coopost> content = queryFactory
                .selectFrom(coopost)
                .where(
                        coopost.deletedAt.isNull(),

                        //커서 조건(정렬 기준에 따라서 동적으로 작동
                        getCursorCondition(cond.getSortBy(), cursorValue, cursorId),

                        //필터 조건
                        keywordContains(cond.getKeyword()),
                        categoryEq(cond.getCategory()),
                        locationEq(cond.getLocation()),
                        priceBetween(cond.getMinPrice(), cond.getMaxPrice()),
                        slotsIn(cond.getSlots()), // 모집 슬롯
                        statusIn(cond.getStatuses(), cond.getExcludeCompleted()),
                        deadlineToday(cond.getDeadlineToday()),
                        periodRecent(cond.getPeriod()) // 기간별 필터 (인기글용)
                )
                .orderBy(getOrderSpecifier(cond.getSortBy()), coopost.coopostId.desc())
                .limit(pageable.getPageSize() + 1)
                .fetch();
        return toSlice(content, pageable);
    }

    @Override
    public Long countByCondition(CoopostSearchCondition cond) {
        // fetchCount()는 deprecated 된 경우가 많아 fetch().size() 혹은 select(coopost.count()) 사용 권장
        Long count = queryFactory
                .select(coopost.count())
                .from(coopost)
                .where(
                        coopost.deletedAt.isNull(),
                        keywordContains(cond.getKeyword()),
                        categoryEq(cond.getCategory()),
                        locationEq(cond.getLocation()),
                        priceBetween(cond.getMinPrice(), cond.getMaxPrice()),
                        slotsIn(cond.getSlots()),
                        statusIn(cond.getStatuses(), cond.getExcludeCompleted()),
                        deadlineToday(cond.getDeadlineToday()),
                        periodRecent(cond.getPeriod())
                )
                .fetchOne();
        return count != null ? count : 0L;
    }

    // --- 기타 검색 조건 메서드들 ---
    private BooleanExpression authorIdEq(int authorId) {
        return authorId > 0 ? coopost.member.id.eq(authorId) : null;
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

    // ... (추가적인 필터 메서드 구현)
    private BooleanExpression priceBetween(Integer min, Integer max) {
        if (min == null && max == null) return null;
        if (min != null && max != null) return coopost.pricePerUnit.between(min, max);
        if (min != null) return coopost.pricePerUnit.goe(min);
        return coopost.pricePerUnit.loe(max);
    }


    // 모집 슬롯 (1~2, 3~4, 5~6, 7이상)
    private BooleanBuilder slotsIn(List<String> slots) {
        if (slots == null || slots.isEmpty()) return null;
        BooleanBuilder builder = new BooleanBuilder();
        for (String slot : slots) {
            if ("1-2".equals(slot)) builder.or(coopost.maxParticipants.between(1, 2));
            else if ("3-4".equals(slot)) builder.or(coopost.maxParticipants.between(3, 4));
            else if ("5-6".equals(slot)) builder.or(coopost.maxParticipants.between(5, 6));
            else if ("7+".equals(slot)) builder.or(coopost.maxParticipants.goe(7));
        }
        return builder;
    }
    // 상태 필터
    private BooleanExpression statusIn(List<CoopostStatus> statuses, Boolean excludeCompleted) {
        if (Boolean.TRUE.equals(excludeCompleted)) {
            return coopost.status.in(CoopostStatus.OPEN, CoopostStatus.CLOSED); // 예: 완료/취소 제외
        }
        return (statuses != null && !statuses.isEmpty()) ? coopost.status.in(statuses) : null;
    }

    // 오늘 마감
    private BooleanExpression deadlineToday(Boolean isToday) {
        if (Boolean.TRUE.equals(isToday)) {
            LocalDateTime start = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
            LocalDateTime end = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
            return coopost.deadlineAt.between(start, end);
        }
        return null;
    }

    // 기간 필터 (인기글 집계용 - 예: 최근 1주 안에 작성된 글)
    private BooleanExpression periodRecent(String period) {
        if ("WEEKLY".equalsIgnoreCase(period)) {
            return coopost.createdAt.after(LocalDateTime.now().minusWeeks(1));
        } else if ("MONTHLY".equalsIgnoreCase(period)) {
            return coopost.createdAt.after(LocalDateTime.now().minusMonths(1));
        }
        return null;
    }

    // --- [정렬] 및 [커서] 로직 ---

    // 정렬 기준에 따른 OrderSpecifier 반환
    private OrderSpecifier<?> getOrderSpecifier(String sortBy) {
        if ("POPULAR".equalsIgnoreCase(sortBy)) return new OrderSpecifier<>(Order.DESC, coopost.viewCount);
        if ("DEADLINE".equalsIgnoreCase(sortBy)) return new OrderSpecifier<>(Order.ASC, coopost.deadlineAt); // 마감 임박순
        if ("OLDEST".equalsIgnoreCase(sortBy)) return new OrderSpecifier<>(Order.ASC, coopost.createdAt);
        // 기본은 최신순
        return new OrderSpecifier<>(Order.DESC, coopost.createdAt);
    }

    // 정렬 기준에 따른 동적 커서 조건 생성
    private BooleanExpression getCursorCondition(String sortBy, Object cursorValue, UUID cursorId) {
        if (cursorValue == null || cursorId == null) return null;

        if ("POPULAR".equalsIgnoreCase(sortBy)) {
            // 조회수 내림차순 (viewCount < cursor OR viewCount == cursor AND id < idCursor)
            long viewVal = (long) cursorValue;
            return coopost.viewCount.lt(viewVal).or(coopost.viewCount.eq(viewVal).and(coopost.coopostId.lt(cursorId)));
        }
        else if ("DEADLINE".equalsIgnoreCase(sortBy)) {
            // 마감임박 오름차순 (deadline > cursor OR deadline == cursor AND id < idCursor)
            // 주의: 오름차순일 경우 부등호 방향이 반대여야 함 (deadline > cursor)
            // 하지만 ID는 보통 중복 방지용으로 항상 DESC나 ASC로 고정하는 편이 좋음. 여기선 2차 정렬도 DESC라고 가정.
            LocalDateTime dateVal = (LocalDateTime) cursorValue;
            return coopost.deadlineAt.gt(dateVal).or(coopost.deadlineAt.eq(dateVal).and(coopost.coopostId.lt(cursorId)));
        }
        else if ("OLDEST".equalsIgnoreCase(sortBy)) {
            // 오래된순 (ASC): createdAt > cursor
            LocalDateTime dateVal = (LocalDateTime) cursorValue;
            return coopost.createdAt.gt(dateVal).or(coopost.createdAt.eq(dateVal).and(coopost.coopostId.lt(cursorId)));
        }
        else {
            // LATEST (기본): createdAt < cursor
            LocalDateTime dateVal = (LocalDateTime) cursorValue;
            return coopost.createdAt.lt(dateVal).or(coopost.createdAt.eq(dateVal).and(coopost.coopostId.lt(cursorId)));
        }
    }



}