package com.gonggoo.gonggoo.scrap.repository;

import com.gonggoo.gonggoo.common.domain.GeoLocation;
import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.gonggoo.gonggoo.coopost.repository.CoopostRepository;
import com.gonggoo.gonggoo.member.domain.Member;
import com.gonggoo.gonggoo.member.repository.MemberRepository;
import com.gonggoo.gonggoo.scrap.domain.Scrap;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.test.context.TestPropertySource;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@TestPropertySource(properties = {
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
class ScrapRepositoryTest {

    @Autowired
    private ScrapRepository scrapRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private CoopostRepository coopostRepository;

    @Test
    @DisplayName("내 스크랩 목록 조회 시 삭제된 공구글은 제외되어야 한다")
    void findMyScraps_excludes_deleted_posts() {
        // given
        Member member = memberRepository.save(createMember("user"));
        Member author = memberRepository.save(createMember("author"));

        // 1. 정상 공구글 생성
        Coopost activePost = coopostRepository.save(createCoopost(author, "정상 글"));

        // 2. 삭제된 공구글 생성 (Soft Delete 적용)
        Coopost deletedPost = createCoopost(author, "삭제된 글");
        // ⭐ [수정] 리포지토리 delete가 아니라, 엔티티의 상태를 변경하고 저장해야 합니다.
        deletedPost.softDelete();
        coopostRepository.save(deletedPost);

        // 3. 둘 다 스크랩
        scrapRepository.save(new Scrap(member, activePost));
        scrapRepository.save(new Scrap(member, deletedPost));

        // when
        // 10개 조회 요청
        Slice<Scrap> result = scrapRepository.findMyScraps(member.getId(), PageRequest.of(0, 10));

        // then
        // 총 2개를 스크랩했지만, 삭제된 글은 제외되어 1개만 조회되어야 함
        assertThat(result.getContent()).hasSize(1);
        // 조회된 1개는 '정상 글'이어야 함
        assertThat(result.getContent().get(0).getCoopost().getTitle()).isEqualTo("정상 글");
    }

    // --- Helper Methods ---
    private Member createMember(String nickname) {
        return Member.builder()
                .nickname(nickname)
                .email(nickname + "@test.com")
                .password("pw")
                .phoneNumber("010-" + nickname.length() + "-0000")
                .location(new GeoLocation(37.0, 127.0))
                .build();
    }

    private Coopost createCoopost(Member author, String title) {
        return Coopost.builder()
                .member(author)
                .title(title)
                .content("내용")
                .status(CoopostStatus.OPEN)
                .pricePerUnit(BigDecimal.valueOf(1000))
                .category(CoopostCategory.FOOD)
                .deadlineAt(LocalDateTime.now().plusDays(1))
                .viewCount(0)
                .build();
    }
}