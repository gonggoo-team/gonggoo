package com.gonggoo.gonggoo.coopost.repository;

import com.gonggoo.gonggoo.common.domain.GeoLocation; // 추가됨
import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostSearchCondition;
import com.gonggoo.gonggoo.member.domain.Member;
import com.gonggoo.gonggoo.member.repository.MemberRepository;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Import(CoopostRepositoryTest.TestConfig.class)
class CoopostRepositoryTest {

    @Autowired
    private CoopostRepository coopostRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private EntityManager em;

    private Member testMember;

    @TestConfiguration
    @EnableJpaAuditing
    static class TestConfig {
        @PersistenceContext
        private EntityManager entityManager;

        @Bean
        public JPAQueryFactory jpaQueryFactory() {
            return new JPAQueryFactory(entityManager);
        }
    }

    @BeforeEach
    void setUp() {
        GeoLocation location = new GeoLocation(37.5665, 126.9780);

        testMember = Member.builder()
                .email("test@test.com")
                .password("password")
                .nickname("테스터")
                .phoneNumber("010-1234-5678")
                .location(location)
                .build();

        memberRepository.save(testMember);
    }

    @Test
    @DisplayName("기본 검색: 키워드와 카테고리로 필터링된다")
    void search_basic() {
        // given
        createCoopost("사과 공동구매", CoopostCategory.FOOD, 1000);
        createCoopost("맥북 공동구매", CoopostCategory.HOME_APPLIANCES, 2000000);
        createCoopost("사과 팝니다", CoopostCategory.FOOD, 1000);

        CoopostSearchCondition cond = new CoopostSearchCondition();
        cond.setKeyword("사과");
        cond.setCategory(CoopostCategory.FOOD);
        cond.setSortBy("LATEST");

        // when
        Slice<Coopost> result = coopostRepository.searchByCondition(cond, null, null, PageRequest.of(0, 10));

        // then
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent()).extracting("title")
                .containsExactlyInAnyOrder("사과 공동구매", "사과 팝니다");
    }

    @Test
    @DisplayName("가격 범위 필터: Min/Max 가격 사이의 글만 조회된다")
    void search_price_range() {
        // given
        createCoopost("싼거", CoopostCategory.ELSE, 1000);
        createCoopost("중간거", CoopostCategory.ELSE, 5000);
        createCoopost("비싼거", CoopostCategory.ELSE, 10000);

        CoopostSearchCondition cond = new CoopostSearchCondition();
        cond.setMinPrice(2000);
        cond.setMaxPrice(6000);

        // when
        Slice<Coopost> result = coopostRepository.searchByCondition(cond, null, null, PageRequest.of(0, 10));

        // then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("중간거");
    }

    @Test
    @DisplayName("모집 슬롯 필터: '1-2', '3-4' 등 구간 조건이 OR로 적용된다")
    void search_slots() {
        // given
        createCoopostWithParticipants("소규모", 2); // 1-2
        createCoopostWithParticipants("중규모", 4); // 3-4
        createCoopostWithParticipants("대규모", 10); // 7+

        CoopostSearchCondition cond = new CoopostSearchCondition();
        // 1-2명 모집 OR 7명 이상 모집 필터
        cond.setSlots(List.of("1-2", "7+"));

        // when
        Slice<Coopost> result = coopostRepository.searchByCondition(cond, null, null, PageRequest.of(0, 10));

        // then
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent()).extracting("title")
                .containsExactlyInAnyOrder("소규모", "대규모");
    }

    @Test
    @DisplayName("상태 필터: 모집 완료 제외(excludeCompleted)가 작동한다")
    void search_exclude_completed() {
        // given
        createCoopostWithStatus("모집중1", CoopostStatus.OPEN);
        createCoopostWithStatus("마감됨", CoopostStatus.CLOSED);
        createCoopostWithStatus("완료됨", CoopostStatus.COMPLETED);
        createCoopostWithStatus("취소됨", CoopostStatus.CANCELED);

        CoopostSearchCondition cond = new CoopostSearchCondition();
        cond.setExcludeCompleted(true); // OPEN, CLOSED만 조회 기대

        // when
        Slice<Coopost> result = coopostRepository.searchByCondition(cond, null, null, PageRequest.of(0, 10));

        // then
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent()).extracting("status")
                .containsExactlyInAnyOrder(CoopostStatus.OPEN, CoopostStatus.CLOSED);
    }

    @Test
    @DisplayName("정렬: 인기순(POPULAR) 정렬 시 조회수가 높은 순으로 나온다")
    void search_sort_popular() {
        // given
        Coopost p1 = createCoopost("인기없음", CoopostCategory.ELSE, 100);
        p1.setViewCount(10);

        Coopost p2 = createCoopost("초인기", CoopostCategory.ELSE, 100);
        p2.setViewCount(100);

        Coopost p3 = createCoopost("중간", CoopostCategory.ELSE, 100);
        p3.setViewCount(50);

        coopostRepository.saveAll(List.of(p1, p2, p3));

        CoopostSearchCondition cond = new CoopostSearchCondition();
        cond.setSortBy("POPULAR");

        // when
        Slice<Coopost> result = coopostRepository.searchByCondition(cond, null, null, PageRequest.of(0, 10));

        // then
        assertThat(result.getContent()).hasSize(3);
        assertThat(result.getContent()).extracting("title")
                .containsExactly("초인기", "중간", "인기없음");
    }

    @Test
    @DisplayName("무한 스크롤: Slice 기능이 정상 작동하며 hasNext를 반환한다")
    void search_pagination() {
        // given
        for (int i = 1; i <= 5; i++) {
            createCoopost("글" + i, CoopostCategory.ELSE, 100);
        }

        CoopostSearchCondition cond = new CoopostSearchCondition();
        Pageable pageable = PageRequest.of(0, 2);

        // when (첫 페이지 조회)
        Slice<Coopost> result = coopostRepository.searchByCondition(cond, null, null, pageable);

        // then
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.hasNext()).isTrue();

        // given (커서 설정)
        Coopost lastPost = result.getContent().get(1);

        // when (두 번째 페이지 조회)
        Slice<Coopost> nextResult = coopostRepository.searchByCondition(cond, lastPost.getCreatedAt(), lastPost.getCoopostId(), pageable);

        // then
        assertThat(nextResult.getContent()).hasSize(2);
        assertThat(nextResult.hasNext()).isTrue();
    }

    @Test
    @DisplayName("Soft Delete: 삭제된 글(deletedAt != null)은 검색되지 않는다")
    void search_soft_delete() {
        // given
        Coopost active = createCoopost("정상글", CoopostCategory.ELSE, 1000);
        Coopost deleted = createCoopost("삭제된글", CoopostCategory.ELSE, 1000);

        deleted.setDeletedAt(LocalDateTime.now());
        coopostRepository.save(deleted);

        CoopostSearchCondition cond = new CoopostSearchCondition();

        // when
        Slice<Coopost> result = coopostRepository.searchByCondition(cond, null, null, PageRequest.of(0, 10));

        // then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("정상글");
    }
    @Test
    @DisplayName("[E 2-1] 할인율 정렬: 할인율이 높은 순서대로 조회된다")
    void search_sort_discount() {
        // given
        // 1. 50% 할인 (10,000 -> 5,000)
        createCoopostWithPrice("반값사과", 10000, 5000);

        // 2. 10% 할인 (10,000 -> 9,000)
        createCoopostWithPrice("찔끔세일", 10000, 9000);

        // 3. 90% 할인 (10,000 -> 1,000)
        createCoopostWithPrice("마감떨이", 10000, 1000);

        CoopostSearchCondition cond = new CoopostSearchCondition();
        cond.setSortBy("DISCOUNT"); // 할인율 순 정렬 요청

        // when
        Slice<Coopost> result = coopostRepository.searchByCondition(cond, null, null, PageRequest.of(0, 10));

        // then
        assertThat(result.getContent()).hasSize(3);
        assertThat(result.getContent()).extracting("title")
                .containsExactly("마감떨이", "반값사과", "찔끔세일");
        // 90% -> 50% -> 10% 순서 확인
    }

    @Test
    @DisplayName("[E 2-1] 동네 기반 조회: 내 동네(location) 글만 조회된다")
    void search_my_town() {
        // given
        createCoopostWithLocation("서울 종로구 글", "서울 종로구");
        createCoopostWithLocation("부산 해운대구 글", "부산 해운대구");

        CoopostSearchCondition cond = new CoopostSearchCondition();
        cond.setLocation("서울 종로구"); // 내 동네 설정

        // when
        Slice<Coopost> result = coopostRepository.searchByCondition(cond, null, null, PageRequest.of(0, 10));

        // then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("서울 종로구 글");
    }

    @Test
    @DisplayName("[E 3-1] 오늘 마감: 마감일이 오늘인 글만 조회된다")
    void search_deadline_today() {
        // given
        createCoopostWithDeadline("어제 마감", LocalDateTime.now().minusDays(1));
        createCoopostWithDeadline("오늘 마감", LocalDateTime.now().plusHours(1)); // 오늘 내
        createCoopostWithDeadline("내일 마감", LocalDateTime.now().plusDays(1));

        CoopostSearchCondition cond = new CoopostSearchCondition();
        cond.setDeadlineToday(true); // 오늘 마감 필터 ON

        // when
        Slice<Coopost> result = coopostRepository.searchByCondition(cond, null, null, PageRequest.of(0, 10));

        // then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("오늘 마감");
    }

    // --- Helper Methods (Test용) ---

    private void createCoopostWithPrice(String title, int originalPrice, int salePrice) {
        coopostRepository.save(Coopost.builder()
                .member(testMember)
                .title(title)
                .content("내용")
                .status(CoopostStatus.OPEN)
                .originalPrice(BigDecimal.valueOf(originalPrice)) // 정가
                .pricePerUnit(BigDecimal.valueOf(salePrice))      // 할인가
                .minParticipants(1)
                .maxParticipants(10)
                .currentParticipants(0)
                .category(CoopostCategory.FOOD)
                .location("서울")
                .deadlineAt(LocalDateTime.now().plusDays(7))
                .viewCount(0)
                .build());
    }

    private void createCoopostWithLocation(String title, String location) {
        coopostRepository.save(Coopost.builder()
                .member(testMember)
                .title(title)
                .content("내용")
                .status(CoopostStatus.OPEN)
                .originalPrice(BigDecimal.valueOf(10000))
                .pricePerUnit(BigDecimal.valueOf(9000))
                .minParticipants(1)
                .maxParticipants(10)
                .currentParticipants(0)
                .category(CoopostCategory.ELSE)
                .location(location) // 위치 설정
                .deadlineAt(LocalDateTime.now().plusDays(7))
                .viewCount(0)
                .build());
    }

    private void createCoopostWithDeadline(String title, LocalDateTime deadline) {
        coopostRepository.save(Coopost.builder()
                .member(testMember)
                .title(title)
                .content("내용")
                .status(CoopostStatus.OPEN)
                .originalPrice(BigDecimal.valueOf(10000))
                .pricePerUnit(BigDecimal.valueOf(9000))
                .minParticipants(1)
                .maxParticipants(10)
                .currentParticipants(0)
                .category(CoopostCategory.ELSE)
                .location("서울")
                .deadlineAt(deadline) // 마감일 설정
                .viewCount(0)
                .build());
    }


    // --- Helper Methods ---

    private Coopost createCoopost(String title, CoopostCategory category, int price) {
        return coopostRepository.save(Coopost.builder()
                .member(testMember)
                .title(title)
                .content("내용")
                .status(CoopostStatus.OPEN)
                .pricePerUnit(BigDecimal.valueOf(price))
                .minParticipants(1)
                .maxParticipants(10)
                .currentParticipants(0)
                .category(category)
                .location("서울")
                .deadlineAt(LocalDateTime.now().plusDays(7))
                .viewCount(0)
                .build());
    }

    private void createCoopostWithParticipants(String title, int maxParticipants) {
        coopostRepository.save(Coopost.builder()
                .member(testMember)
                .title(title)
                .content("내용")
                .status(CoopostStatus.OPEN)
                .pricePerUnit(BigDecimal.valueOf(1000))
                .minParticipants(1)
                .maxParticipants(maxParticipants)
                .currentParticipants(0)
                .category(CoopostCategory.ELSE)
                .location("서울")
                .deadlineAt(LocalDateTime.now().plusDays(7))
                .viewCount(0)
                .build());
    }

    private void createCoopostWithStatus(String title, CoopostStatus status) {
        coopostRepository.save(Coopost.builder()
                .member(testMember)
                .title(title)
                .content("내용")
                .status(status)
                .pricePerUnit(BigDecimal.valueOf(1000))
                .minParticipants(1)
                .maxParticipants(10)
                .currentParticipants(0)
                .category(CoopostCategory.ELSE)
                .location("서울")
                .deadlineAt(LocalDateTime.now().plusDays(7))
                .viewCount(0)
                .build());
    }
}