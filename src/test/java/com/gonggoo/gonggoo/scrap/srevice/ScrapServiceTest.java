package com.gonggoo.gonggoo.scrap.service;

import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.repository.CoopostRepository;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import com.gonggoo.gonggoo.global.response.ErrorCode;
import com.gonggoo.gonggoo.member.domain.Member;
import com.gonggoo.gonggoo.member.repository.MemberRepository;
import com.gonggoo.gonggoo.scrap.domain.Scrap;
import com.gonggoo.gonggoo.scrap.dto.request.ScrapCreateRequest;
import com.gonggoo.gonggoo.scrap.repository.ScrapRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ScrapServiceTest {

    @InjectMocks
    private ScrapServiceImpl scrapService;

    @Mock
    private ScrapRepository scrapRepository;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private CoopostRepository coopostRepository;

    // --- Helper Methods ---
    private ScrapCreateRequest createRequest(UUID coopostId) {
        ScrapCreateRequest req = new ScrapCreateRequest();
        ReflectionTestUtils.setField(req, "coopostId", coopostId); // private 필드 값 주입
        return req;
    }

    private Member createMember(int id) {
        Member member = mock(Member.class);
        return member;
    }

    private Coopost createCoopost(UUID id) {
        Coopost coopost = mock(Coopost.class);
        return coopost;
    }

    @Nested
    @DisplayName("스크랩 토글 테스트")
    class ToggleScrapTest {

        @Test
        @DisplayName("생성: 스크랩 내역이 없으면 새로 저장하고 true를 반환한다")
        void toggle_create_success() {
            // given
            int memberId = 1;
            UUID coopostId = UUID.randomUUID();
            ScrapCreateRequest req = createRequest(coopostId);

            Member member = createMember(memberId);
            Coopost coopost = createCoopost(coopostId);

            // Mocking: 내역이 없음 (Optional.empty)
            given(scrapRepository.findByMemberIdAndCoopostCoopostId(memberId, coopostId))
                    .willReturn(Optional.empty());
            given(memberRepository.findById(memberId)).willReturn(Optional.of(member));
            given(coopostRepository.findById(coopostId)).willReturn(Optional.of(coopost));

            // when
            boolean result = scrapService.toggleScrap(memberId, req);

            // then
            assertThat(result).isTrue(); // 생성됨 -> true
            verify(scrapRepository, times(1)).save(any(Scrap.class)); // save 호출 확인
            verify(scrapRepository, never()).delete(any(Scrap.class)); // delete 호출 안 함
        }

        @Test
        @DisplayName("삭제: 이미 스크랩 내역이 있으면 삭제하고 false를 반환한다")
        void toggle_delete_success() {
            // given
            int memberId = 1;
            UUID coopostId = UUID.randomUUID();
            ScrapCreateRequest req = createRequest(coopostId);

            Scrap existingScrap = mock(Scrap.class); // 이미 존재하는 스크랩

            // Mocking: 내역이 있음 (Optional.of)
            given(scrapRepository.findByMemberIdAndCoopostCoopostId(memberId, coopostId))
                    .willReturn(Optional.of(existingScrap));

            // when
            boolean result = scrapService.toggleScrap(memberId, req);

            // then
            assertThat(result).isFalse(); // 삭제됨 -> false
            verify(scrapRepository, times(1)).delete(existingScrap); // delete 호출 확인
            verify(scrapRepository, never()).save(any(Scrap.class)); // save 호출 안 함
        }

        @Test
        @DisplayName("실패: 존재하지 않는 공구글을 스크랩하려 하면 예외가 발생한다")
        void toggle_fail_coopost_not_found() {
            // given
            int memberId = 1;
            UUID coopostId = UUID.randomUUID();
            ScrapCreateRequest req = createRequest(coopostId);

            given(scrapRepository.findByMemberIdAndCoopostCoopostId(memberId, coopostId))
                    .willReturn(Optional.empty()); // 생성 시도
            given(memberRepository.findById(memberId)).willReturn(Optional.of(createMember(memberId)));
            given(coopostRepository.findById(coopostId)).willReturn(Optional.empty()); // 공구글 없음

            // when & then
            assertThatThrownBy(() -> scrapService.toggleScrap(memberId, req))
                    .isInstanceOf(NeighborsException.class)
                    .hasMessage(ErrorCode.COOPOST_NOT_FOUND.getMessage());
        }
    }
}