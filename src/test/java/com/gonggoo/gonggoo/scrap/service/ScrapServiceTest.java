package com.gonggoo.gonggoo.scrap.service;

import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.repository.CoopostRepository;
import com.gonggoo.gonggoo.coopost.dto.response.SliceResponse;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import com.gonggoo.gonggoo.global.response.ErrorCode;
import com.gonggoo.gonggoo.member.domain.Member;
import com.gonggoo.gonggoo.member.repository.MemberRepository;
import com.gonggoo.gonggoo.scrap.domain.Scrap;
import com.gonggoo.gonggoo.scrap.dto.request.ScrapCreateRequest;
import com.gonggoo.gonggoo.scrap.dto.response.ScrapResponse;
import com.gonggoo.gonggoo.scrap.repository.ScrapRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
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

    // --- Helper Methods (Setter 대체) ---
    private ScrapCreateRequest createRequest(UUID coopostId) {
        ScrapCreateRequest req = new ScrapCreateRequest();
        ReflectionTestUtils.setField(req, "coopostId", coopostId);
        return req;
    }

    private Member createMember(int id) {
        Member member = Member.builder().nickname("user").build();
        ReflectionTestUtils.setField(member, "id", id);
        return member;
    }

    private Coopost createCoopost(UUID id) {
        Coopost coopost = Coopost.builder().title("Title").build();
        ReflectionTestUtils.setField(coopost, "coopostId", id);
        return coopost;
    }

    private Scrap createScrap(Member m, Coopost c) {
        return Scrap.builder().member(m).coopost(c).build();
    }

    @Nested
    @DisplayName("스크랩 토글(Toggle) 테스트")
    class ToggleTest {

        @Test
        @DisplayName("생성: 기존 스크랩이 없으면 -> 새로 저장하고 true 반환")
        void toggle_create() {
            // given
            int memberId = 1;
            UUID coopostId = UUID.randomUUID();
            ScrapCreateRequest req = createRequest(coopostId);

            Member member = createMember(memberId);
            Coopost coopost = createCoopost(coopostId);

            given(scrapRepository.findByMemberIdAndCoopostCoopostId(memberId, coopostId))
                    .willReturn(Optional.empty()); // 없음
            given(memberRepository.findById(memberId)).willReturn(Optional.of(member));
            given(coopostRepository.findById(coopostId)).willReturn(Optional.of(coopost));

            // when
            boolean result = scrapService.toggleScrap(memberId, req);

            // then
            assertThat(result).isTrue();
            verify(scrapRepository, times(1)).save(any(Scrap.class)); // 저장 호출 확인
            verify(scrapRepository, never()).delete(any(Scrap.class));
        }

        @Test
        @DisplayName("취소: 기존 스크랩이 있으면 -> 삭제하고 false 반환")
        void toggle_delete() {
            // given
            int memberId = 1;
            UUID coopostId = UUID.randomUUID();
            ScrapCreateRequest req = createRequest(coopostId);

            Scrap existingScrap = createScrap(createMember(memberId), createCoopost(coopostId));

            given(scrapRepository.findByMemberIdAndCoopostCoopostId(memberId, coopostId))
                    .willReturn(Optional.of(existingScrap)); // 있음

            // when
            boolean result = scrapService.toggleScrap(memberId, req);

            // then
            assertThat(result).isFalse();
            verify(scrapRepository, times(1)).delete(existingScrap); // 삭제 호출 확인
            verify(scrapRepository, never()).save(any(Scrap.class));
        }

        @Test
        @DisplayName("예외: 공구글이 존재하지 않으면 예외 발생")
        void toggle_fail_not_found() {
            // given
            int memberId = 1;
            UUID coopostId = UUID.randomUUID();
            ScrapCreateRequest req = createRequest(coopostId);

            given(scrapRepository.findByMemberIdAndCoopostCoopostId(memberId, coopostId))
                    .willReturn(Optional.empty());
            given(memberRepository.findById(memberId)).willReturn(Optional.of(createMember(memberId)));
            given(coopostRepository.findById(coopostId)).willReturn(Optional.empty()); // 공구글 없음

            // when & then
            assertThatThrownBy(() -> scrapService.toggleScrap(memberId, req))
                    .isInstanceOf(NeighborsException.class)
                    .hasMessage(ErrorCode.COOPOST_NOT_FOUND.getMessage());
        }
    }

    @Test
    @DisplayName("내 스크랩 목록 조회: DTO로 잘 변환되어 반환된다")
    void getMyScraps() {
        // given
        int memberId = 1;
        Pageable pageable = PageRequest.of(0, 10);

        Coopost c = createCoopost(UUID.randomUUID());
        Scrap s = createScrap(createMember(memberId), c);

        Slice<Scrap> scrapSlice = new SliceImpl<>(List.of(s), pageable, false);

        given(scrapRepository.findMyScraps(memberId, pageable)).willReturn(scrapSlice);

        // when
        SliceResponse<ScrapResponse> response = scrapService.getMyScraps(memberId, pageable);

        // then
        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getContent().get(0).getCoopostId()).isEqualTo(c.getCoopostId());
    }
}