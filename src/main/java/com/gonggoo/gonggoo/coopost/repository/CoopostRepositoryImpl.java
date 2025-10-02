package com.gonggoo.gonggoo.coopost.repository;

import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static com.gonggoo.gonggoo.coopost.domain.QCoopost.coopost; // QCoopost import

public class CoopostRepositoryImpl implements CoopostRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public CoopostRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public Page<Coopost> search(String keyword, CoopostCategory category, String location, LocalDateTime cursor, Pageable pageable) {
        List<Coopost> content = queryFactory
                .selectFrom(coopost)
                .where(
                        ltCursor(cursor),
                        coopost.status.ne(CoopostStatus.DELETED),
                        keywordContains(keyword),
                        categoryEq(category),
                        locationEq(location)
                )
                .orderBy(coopost.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory
                .select(coopost.count())
                .from(coopost)
                .where(
                        coopost.status.ne(CoopostStatus.DELETED),
                        keywordContains(keyword),
                        categoryEq(category),
                        locationEq(location)
                );

        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }

    @Override
    public Page<Coopost> findMyPosts(UUID authorId, LocalDateTime cursor, Pageable pageable) {
        List<Coopost> content = queryFactory
                .selectFrom(coopost)
                .where(
                        ltCursor(cursor),
                        coopost.status.ne(CoopostStatus.DELETED),
                        coopost.authorId.eq(authorId)
                )
                .orderBy(coopost.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory
                .select(coopost.count())
                .from(coopost)
                .where(
                        coopost.status.ne(CoopostStatus.DELETED),
                        coopost.authorId.eq(authorId)
                );

        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }

    @Override
    public Page<Coopost> findPopular(Long viewCountCursor, UUID idCursor, Pageable pageable) {
        List<Coopost> content = queryFactory
                .selectFrom(coopost)
                .where(
                        coopost.status.ne(CoopostStatus.DELETED),
                        popularCursor(viewCountCursor, idCursor) // 커서 조건
                )
                .orderBy(coopost.viewCount.desc(), coopost.coopostId.desc())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory
                .select(coopost.count())
                .from(coopost)
                .where(coopost.status.ne(CoopostStatus.DELETED));

        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }

    // === BooleanExpression을 사용한 동적 쿼리 메서드들 ===

    private BooleanExpression ltCursor(LocalDateTime cursor) {
        return cursor != null ? coopost.createdAt.before(cursor) : null;
    }

    private BooleanExpression popularCursor(Long viewCountCursor, UUID idCursor) {
        if (viewCountCursor == null || idCursor == null) {
            return null; // 커서가 없으면 조건 없음 (첫 페이지)
        }
        // (viewCount < cursor) OR (viewCount = cursor AND coopostId < cursor)
        return coopost.viewCount.lt(viewCountCursor)
                .or(coopost.viewCount.eq(viewCountCursor).and(coopost.coopostId.lt(idCursor)));
    }

    private BooleanExpression keywordContains(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return null;
        }
        return coopost.title.containsIgnoreCase(keyword)
                .or(coopost.content.containsIgnoreCase(keyword));
    }

    private BooleanExpression categoryEq(CoopostCategory category) {
        return category != null ? coopost.category.eq(category) : null;
    }

    private BooleanExpression locationEq(String location) {
        return location != null && !location.trim().isEmpty() ? coopost.location.eq(location) : null;
    }
}