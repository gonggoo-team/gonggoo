package com.gonggoo.gonggoo.coopost.service;

import com.gonggoo.gonggoo.common.domain.GeoLocation;
import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.domain.CoopostMember;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.gonggoo.gonggoo.coopost.dto.request.ApplyRequest;
import com.gonggoo.gonggoo.coopost.dto.response.ApplyResponse;
import com.gonggoo.gonggoo.coopost.repository.CoopostMemberRepository;
import com.gonggoo.gonggoo.coopost.repository.CoopostRepository;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import com.gonggoo.gonggoo.global.response.ErrorCode;
import com.gonggoo.gonggoo.member.domain.Member;
import com.gonggoo.gonggoo.member.repository.MemberRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(properties = {
        "spring.config.name=gonggoo-prod",

        // 1. H2 DB 설정 (MySQL 모드 유지)
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.url=jdbc:h2:mem:testdb;MODE=MySQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.username=sa",
        "spring.datasource.password=",

        // 2. [핵심] Dialect를 MySQL8로 변경 (MODE=MySQL과 짝을 맞춤)
        "spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect",

        // 3. DDL 자동 생성 설정
        "spring.jpa.hibernate.ddl-auto=create-drop",

        // 4. [중요] prod 설정의 SQL 스크립트 실행 방지 (충돌 방지)
        "spring.sql.init.mode=never",

        // 5. 에러 로그 확인용
        "spring.jpa.show-sql=true",
        "spring.jpa.properties.hibernate.format_sql=true"
})

class ApplyServiceTest {

    @Autowired
    private ApplyServiceImpl applyService;

    @Autowired
    private CoopostRepository coopostRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private CoopostMemberRepository applyRepository;

    private Member author;
    private Member applicant;
    private Coopost coopost;

    @BeforeEach
    void setUp() {
        // ⭐ [핵심 수정] 이전 테스트(특히 동시성 테스트)에서 남은 데이터 삭제
        // 외래키 제약조건 때문에 자식 테이블부터 순서대로 지워야 합니다.
        applyRepository.deleteAllInBatch(); // 혹은 deleteAll()
        coopostRepository.deleteAllInBatch();
        memberRepository.deleteAllInBatch();

        // 1. 회원 생성
        author = createMember("author", "010-1111-1111");
        applicant = createMember("applicant", "010-2222-2222");

        // 2. 공구글 생성
        coopost = Coopost.builder()
                .member(author)
                .title("테스트 공구")
                .content("내용")
                .status(CoopostStatus.OPEN)
                .pricePerUnit(BigDecimal.valueOf(10000))
                .originalPrice(BigDecimal.valueOf(12000))
                .minParticipants(1)
                .maxParticipants(10)
                .currentParticipants(0)
                .category(CoopostCategory.FOOD)
                .location("서울")
                .deadlineAt(LocalDateTime.now().plusDays(1))
                .viewCount(0)
                .build();
        coopostRepository.save(coopost);

        mockLogin(applicant);
    }
    @AfterEach
    void tearDown() {
        // 테스트가 끝나면 인증 정보 초기화 (다른 테스트 오염 방지)
        SecurityContextHolder.clearContext();
    }
    @Test
    @Transactional
    @DisplayName("공구 신청 성공: 참여 인원이 1 증가하고 신청 내역이 저장된다")
    void apply_success() {
        // given
        ApplyRequest req = new ApplyRequest();
        req.setCoopostId(coopost.getCoopostId());

        // when
        ApplyResponse response = applyService.apply(applicant.getId(), req);

        // then
        Coopost updatedPost = coopostRepository.findById(coopost.getCoopostId()).get();
        assertThat(updatedPost.getCurrentParticipants()).isEqualTo(1);

        boolean isApplied = applyRepository.existsByCoopostCoopostIdAndMemberId(coopost.getCoopostId(), applicant.getId());
        assertThat(isApplied).isTrue();
    }
    @Test
    @Transactional
    @DisplayName("신청 실패: 본인이 작성한 글에는 신청할 수 없다")
    void apply_fail_own_post() {
        // given
        // ✅ 이 테스트에서는 작성자(author)가 로그인한 척 해야 함
        mockLogin(author);

        ApplyRequest req = new ApplyRequest();
        req.setCoopostId(coopost.getCoopostId());

        // when & then
        assertThatThrownBy(() -> applyService.apply(author.getId(), req))
                .isInstanceOf(NeighborsException.class)
                .hasMessage(ErrorCode.CANNOT_APPLY_OWN_POST.getMessage());
    }

    @Test
    @Transactional
    @DisplayName("신청 실패: 이미 신청한 공구에는 중복 신청할 수 없다")
    void apply_fail_duplicate() {
        // given
        ApplyRequest req = new ApplyRequest();
        req.setCoopostId(coopost.getCoopostId());
        applyService.apply(applicant.getId(), req); // 1회차 신청

        // when & then
        assertThatThrownBy(() -> applyService.apply(applicant.getId(), req)) // 2회차 신청
                .isInstanceOf(NeighborsException.class)
                .hasMessage(ErrorCode.ALREADY_APPLIED.getMessage());
    }

    @Test
    @Transactional
    @DisplayName("신청 취소: 신청 내역이 삭제되고 참여 인원이 감소한다")
    void cancel_success() {
        // given
        ApplyRequest req = new ApplyRequest();
        req.setCoopostId(coopost.getCoopostId());
        ApplyResponse applied = applyService.apply(applicant.getId(), req);

        // when
        applyService.cancel(applicant.getId(), applied.getApplyId());

        // then
        Coopost updatedPost = coopostRepository.findById(coopost.getCoopostId()).get();
        assertThat(updatedPost.getCurrentParticipants()).isEqualTo(0);

        boolean exists = applyRepository.existsById(applied.getApplyId());
        assertThat(exists).isFalse();
    }

    // ⭐ 동시성 테스트
    @Test
    @DisplayName("동시성 이슈 테스트: 5명 정원인 글에 10명이 동시에 신청하면 정확히 5명만 성공해야 한다")
    void concurrency_test() throws InterruptedException {
        // given
        int maxParticipants = 5;
        coopost.setMaxParticipants(maxParticipants);
        coopostRepository.saveAndFlush(coopost);

        int tryCount = 10;
        ExecutorService executorService = Executors.newFixedThreadPool(tryCount);
        CountDownLatch latch = new CountDownLatch(tryCount);

        AtomicInteger successCount = new AtomicInteger();
        AtomicInteger failCount = new AtomicInteger();

        // when
        for (int i = 0; i < tryCount; i++) {
            final int userIndex = i;
            executorService.submit(() -> {
                try {
                    // 각 스레드마다 새로운 멤버 생성
                    Member concurrentUser = createMemberForConcurrency("user" + userIndex, "010-0000-" + userIndex);

                    // ✅ [중요] 비동기 스레드 내부에서 인증 정보 주입
                    // SecurityContext는 ThreadLocal이라 메인 스레드의 설정이 공유되지 않습니다.
                    mockLogin(concurrentUser);

                    ApplyRequest req = new ApplyRequest();
                    req.setCoopostId(coopost.getCoopostId());

                    applyService.apply(concurrentUser.getId(), req);
                    successCount.getAndIncrement();
                } catch (Exception e) {
                    failCount.getAndIncrement();
                } finally {
                    // 스레드 사용 후 컨텍스트 정리
                    SecurityContextHolder.clearContext();
                    latch.countDown();
                }
            });
        }

        latch.await();

        // then
        Coopost resultPost = coopostRepository.findById(coopost.getCoopostId()).get();

        assertThat(resultPost.getCurrentParticipants()).isEqualTo(maxParticipants);
        assertThat(successCount.get()).isEqualTo(maxParticipants);
        assertThat(failCount.get()).isEqualTo(tryCount - maxParticipants);
    }

    // --- Helper Methods ---

    /**
     * ✅ JWT 토큰 없이 SecurityContext에 직접 인증 객체를 주입하는 메서드
     * 서비스 레이어 테스트에서는 필터를 거치지 않으므로 이 방식이 정석입니다.
     */
    private void mockLogin(Member member) {
        // Principal에 Member 객체 자체나 UserDetailsImpl 등을 넣습니다.
        // 실제 프로젝트의 UserDetails 구현체에 맞춰 수정이 필요할 수 있습니다.
        // 여기서는 가장 단순하게 Member ID나 객체를 Principal로 잡습니다.
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        member, // Principal (보통 UserDetails 구현체나 Member 엔티티)
                        null,   // Credentials (패스워드 등, 테스트엔 불필요)
                        Collections.emptyList() // Authorities (ROLE_USER 등)
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private Member createMember(String nickname, String phone) {
        return memberRepository.save(Member.builder()
                .nickname(nickname)
                .email(nickname + "@test.com")
                .password("pw")
                .phoneNumber(phone)
                .location(new GeoLocation(37.5, 127.0))
                .build());
    }

    private Member createMemberForConcurrency(String nickname, String phone) {
        return memberRepository.save(Member.builder()
                .nickname(nickname)
                .email(nickname + "@test.com")
                .password("pw")
                .phoneNumber(phone)
                .location(new GeoLocation(37.5, 127.0))
                .build());
    }
}