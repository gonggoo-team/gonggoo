package com.gonggoo.gonggoo.coopost.service;

import com.gonggoo.gonggoo.common.domain.GeoLocation;
import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.domain.CoopostMember;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.gonggoo.gonggoo.coopost.dto.response.CoopostResponse;
import com.gonggoo.gonggoo.coopost.repository.CoopostMemberRepository;
import com.gonggoo.gonggoo.coopost.repository.CoopostRepository;
import com.gonggoo.gonggoo.member.domain.Member;
import com.gonggoo.gonggoo.member.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {
        "spring.config.name=gonggoo-prod",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.url=jdbc:h2:mem:testdb;MODE=MySQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect",
        "spring.sql.init.mode=never"
})
class CoopostServiceTest {

    @Autowired
    private CoopostServiceImpl coopostService;

    @Autowired
    private CoopostRepository coopostRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private CoopostMemberRepository applyRepository;

    private Member author;
    private Member user;
    private Coopost coopost;

    @BeforeEach
    void setUp() {
        // 데이터 초기화 (순서 중요: 자식 -> 부모)
        applyRepository.deleteAllInBatch();
        coopostRepository.deleteAllInBatch();
        memberRepository.deleteAllInBatch();

        // 1. 작성자 생성
        author = memberRepository.save(Member.builder()
                .nickname("author")
                .email("author@test.com")
                .password("pw")
                .phoneNumber("010-1111-1111")
                .location(new GeoLocation(37.5, 127.0))
                .build());

        // 2. 일반 유저 생성 (신청할 사람)
        user = memberRepository.save(Member.builder()
                .nickname("user")
                .email("user@test.com")
                .password("pw")
                .phoneNumber("010-2222-2222")
                .location(new GeoLocation(37.5, 127.0))
                .build());

        // 3. 공구글 생성
        coopost = coopostRepository.save(Coopost.builder()
                .member(author)
                .title("맛있는 귤 공구")
                .content("같이 사요")
                .status(CoopostStatus.OPEN)
                .pricePerUnit(BigDecimal.valueOf(10000))
                .minParticipants(1)
                .maxParticipants(10)
                .currentParticipants(0)
                .category(CoopostCategory.FOOD)
                .location("서울")
                .deadlineAt(LocalDateTime.now().plusDays(3))
                .viewCount(0)
                .build());
    }

    @Test
    @Transactional
    @DisplayName("상세 조회 - 로그인 안 한 경우 (Guest)")
    void getDetail_guest() {
        // given
        Integer memberId = null; // 비로그인

        // when
        CoopostResponse response = coopostService.getDetailById(coopost.getCoopostId(), memberId);

        // then
        assertThat(response.getTitle()).isEqualTo("맛있는 귤 공구");
        assertThat(response.isApplied()).isFalse(); // 신청 여부 false
        assertThat(response.getMyApplyId()).isNull(); // ID null
    }

    @Test
    @Transactional
    @DisplayName("상세 조회 - 로그인 했지만 신청 안 한 경우")
    void getDetail_login_not_applied() {
        // given
        Integer memberId = user.getId();

        // when
        CoopostResponse response = coopostService.getDetailById(coopost.getCoopostId(), memberId);

        // then
        assertThat(response.isApplied()).isFalse(); // 신청 여부 false
        assertThat(response.getMyApplyId()).isNull();
    }

    @Test
    @Transactional
    @DisplayName("상세 조회 - 로그인 했고 이미 신청한 경우")
    void getDetail_login_applied() {
        // given
        // 미리 신청 데이터를 DB에 넣어둠 (Service의 apply 로직을 타거나 직접 저장)
        CoopostMember apply = applyRepository.save(CoopostMember.builder()
                .coopost(coopost)
                .member(user)
                .build());

        Integer memberId = user.getId();

        // when
        CoopostResponse response = coopostService.getDetailById(coopost.getCoopostId(), memberId);

        // then
        assertThat(response.isApplied()).isTrue(); // ⭐ 신청 여부 True!
        assertThat(response.getMyApplyId()).isEqualTo(apply.getId()); // ⭐ 취소할 때 쓸 ID가 일치하는지 확인
    }

    @Test
    @Transactional
    @DisplayName("상세 조회 - 조회수 증가 확인")
    void getDetail_view_count() {
        // given
        long beforeViewCount = coopost.getViewCount();

        // when
        coopostService.getDetailById(coopost.getCoopostId(), null);

        // then
        Coopost updatedPost = coopostRepository.findById(coopost.getCoopostId()).get();
        assertThat(updatedPost.getViewCount()).isEqualTo(beforeViewCount + 1);
    }
}