package com.gonggoo.gonggoo.coopost.service;

import com.gonggoo.gonggoo.coopost.domain.*;
import com.gonggoo.gonggoo.coopost.dto.request.ApplyRequest;
import com.gonggoo.gonggoo.coopost.dto.response.ApplyResponse;
import com.gonggoo.gonggoo.coopost.repository.CoopostMemberRepository;
import com.gonggoo.gonggoo.coopost.repository.CoopostRepository;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import com.gonggoo.gonggoo.global.response.ErrorCode;
import com.gonggoo.gonggoo.member.domain.Member;
import com.gonggoo.gonggoo.member.repository.MemberRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplyServiceTest2 {

    @InjectMocks
    private ApplyServiceImpl applyService;

    @Mock
    private CoopostMemberRepository applyRepository;

    @Mock
    private CoopostRepository coopostRepository;

    @Mock
    private MemberRepository memberRepository;

    // --- Helper for Test Data ---
    private Member createMember(int id) {
        Member member = mock(Member.class);
        given(member.getId()).willReturn(id);
        return member;
    }

    private Coopost createCoopost(Member author, int current, int max, CoopostStatus status) {
        return Coopost.builder()
                .coopostId(UUID.randomUUID())
                .member(author)
                .title("테스트 공구")
                .status(status)
                .currentParticipants(current)
                .maxParticipants(max)
                .build();
    }

    @Nested
    @DisplayName("공구 신청 테스트")
    class ApplyTest {

        @Test
        @DisplayName("성공: 최초 신청 시 ACTIVE 상태로 저장되고 인원이 증가한다")
        void apply_success_new() {
            // given
            int memberId = 1;
            int authorId = 2;
            UUID coopostId = UUID.randomUUID();

            Member applicant = createMember(memberId);
            Member author = createMember(authorId);
            Coopost coopost = createCoopost(author, 0, 10, CoopostStatus.OPEN);
            coopost.setCoopostId(coopostId);

            ApplyRequest req = new ApplyRequest();
            req.setCoopostId(coopostId);

            // mocking
            given(memberRepository.findById(memberId)).willReturn(Optional.of(applicant));
            given(coopostRepository.getByIdWithLock(coopostId)).willReturn(coopost);
            given(applyRepository.findByCoopostAndMember(coopost, applicant)).willReturn(Optional.empty()); // 최초 신청

            // save 호출 시 객체 반환
            given(applyRepository.save(any(CoopostMember.class))).willAnswer(invocation -> {
                CoopostMember saved = invocation.getArgument(0);
                return saved; // ID는 null이지만 테스트엔 문제 없음
            });

            // when
            ApplyResponse response = applyService.apply(memberId, req);

            // then
            assertThat(response.getCurrentParticipants()).isEqualTo(1); // 0 -> 1
            verify(applyRepository, times(1)).save(any(CoopostMember.class));
        }

        @Test
        @DisplayName("성공: 취소했던 공구에 재신청 시 상태가 ACTIVE로 변경된다")
        void apply_success_reapply() {
            // given
            int memberId = 1;
            UUID coopostId = UUID.randomUUID();
            Member applicant = createMember(memberId);
            Coopost coopost = createCoopost(createMember(2), 5, 10, CoopostStatus.OPEN);
            coopost.setCoopostId(coopostId);

            // 이미 존재하지만 CANCELED 상태인 내역
            CoopostMember existingApply = CoopostMember.builder()
                    .coopost(coopost)
                    .member(applicant)
                    .status(ApplyStatus.CANCELED)
                    .build();

            ApplyRequest req = new ApplyRequest();
            req.setCoopostId(coopostId);

            // mocking
            given(memberRepository.findById(memberId)).willReturn(Optional.of(applicant));
            given(coopostRepository.getByIdWithLock(coopostId)).willReturn(coopost);
            given(applyRepository.findByCoopostAndMember(coopost, applicant)).willReturn(Optional.of(existingApply));

            // when
            ApplyResponse response = applyService.apply(memberId, req);

            // then
            assertThat(existingApply.getStatus()).isEqualTo(ApplyStatus.ACTIVE); // 상태 변경 확인
            assertThat(response.getCurrentParticipants()).isEqualTo(6); // 5 -> 6
            verify(applyRepository, never()).save(any(CoopostMember.class)); // save 호출 안 함 (Dirty Checking)
        }

        @Test
        @DisplayName("성공: 신청으로 인해 정원이 가득 차면 공구 상태가 CLOSED로 변경된다")
        void apply_success_close_post() {
            // given
            int memberId = 1;
            UUID coopostId = UUID.randomUUID();
            Member applicant = createMember(memberId);
            // 9/10명인 상태에서 신청
            Coopost coopost = createCoopost(createMember(2), 9, 10, CoopostStatus.OPEN);
            coopost.setCoopostId(coopostId);

            ApplyRequest req = new ApplyRequest();
            req.setCoopostId(coopostId);

            given(memberRepository.findById(memberId)).willReturn(Optional.of(applicant));
            given(coopostRepository.getByIdWithLock(coopostId)).willReturn(coopost);
            given(applyRepository.findByCoopostAndMember(coopost, applicant)).willReturn(Optional.empty());
            given(applyRepository.save(any())).willAnswer(i -> i.getArgument(0));

            // when
            applyService.apply(memberId, req);

            // then
            assertThat(coopost.getCurrentParticipants()).isEqualTo(10);
            assertThat(coopost.getStatus()).isEqualTo(CoopostStatus.CLOSED); // CLOSED 확인
        }

        @Test
        @DisplayName("실패: 본인이 작성한 공구에는 신청할 수 없다")
        void apply_fail_own_post() {
            // given
            int memberId = 1;
            UUID coopostId = UUID.randomUUID();
            Member author = createMember(memberId); // 작성자 본인
            Coopost coopost = createCoopost(author, 0, 10, CoopostStatus.OPEN);
            coopost.setCoopostId(coopostId);

            ApplyRequest req = new ApplyRequest();
            req.setCoopostId(coopostId);

            given(memberRepository.findById(memberId)).willReturn(Optional.of(author));
            given(coopostRepository.getByIdWithLock(coopostId)).willReturn(coopost);

            // when & then
            assertThatThrownBy(() -> applyService.apply(memberId, req))
                    .isInstanceOf(NeighborsException.class)
                    .hasMessage(ErrorCode.CANNOT_APPLY_OWN_POST.getMessage());
        }

        @Test
        @DisplayName("실패: 이미 참여 중인(ACTIVE) 공구에는 중복 신청할 수 없다")
        void apply_fail_duplicate() {
            // given
            int memberId = 1;
            UUID coopostId = UUID.randomUUID();
            Member applicant = createMember(memberId);
            Coopost coopost = createCoopost(createMember(2), 1, 10, CoopostStatus.OPEN);
            coopost.setCoopostId(coopostId);

            // ACTIVE 상태의 내역 존재
            CoopostMember existingApply = CoopostMember.builder()
                    .coopost(coopost)
                    .member(applicant)
                    .status(ApplyStatus.ACTIVE)
                    .build();

            ApplyRequest req = new ApplyRequest();
            req.setCoopostId(coopostId);

            given(memberRepository.findById(memberId)).willReturn(Optional.of(applicant));
            given(coopostRepository.getByIdWithLock(coopostId)).willReturn(coopost);
            given(applyRepository.findByCoopostAndMember(coopost, applicant)).willReturn(Optional.of(existingApply));

            // when & then
            assertThatThrownBy(() -> applyService.apply(memberId, req))
                    .isInstanceOf(NeighborsException.class)
                    .hasMessage(ErrorCode.ALREADY_APPLIED.getMessage());
        }

        @Test
        @DisplayName("실패: 마감된(CLOSED) 공구에는 신청할 수 없다")
        void apply_fail_closed() {
            // given
            int memberId = 1;
            UUID coopostId = UUID.randomUUID();
            Coopost coopost = createCoopost(createMember(2), 10, 10, CoopostStatus.CLOSED);
            coopost.setCoopostId(coopostId);

            ApplyRequest req = new ApplyRequest();
            req.setCoopostId(coopostId);

            given(memberRepository.findById(memberId)).willReturn(Optional.of(createMember(memberId)));
            given(coopostRepository.getByIdWithLock(coopostId)).willReturn(coopost);

            // when & then
            assertThatThrownBy(() -> applyService.apply(memberId, req))
                    .isInstanceOf(NeighborsException.class)
                    .hasMessage(ErrorCode.COOPOST_CLOSED.getMessage());
        }
    }

    @Nested
    @DisplayName("공구 취소 테스트")
    class CancelTest {

        @Test
        @DisplayName("성공: 신청 취소 시 상태가 CANCELED로 변경되고 인원이 감소한다")
        void cancel_success() {
            // given
            int memberId = 1;
            UUID applyId = UUID.randomUUID();
            UUID coopostId = UUID.randomUUID();

            Coopost coopost = createCoopost(createMember(2), 5, 10, CoopostStatus.OPEN);
            coopost.setCoopostId(coopostId);

            CoopostMember apply = CoopostMember.builder()
                    .coopost(coopost)
                    .member(createMember(memberId))
                    .status(ApplyStatus.ACTIVE)
                    .build();

            given(applyRepository.findByIdAndMemberId(applyId, memberId)).willReturn(Optional.of(apply));
            given(coopostRepository.getByIdWithLock(coopostId)).willReturn(coopost);

            // when
            ApplyResponse response = applyService.cancel(memberId, applyId);

            // then
            assertThat(apply.getStatus()).isEqualTo(ApplyStatus.CANCELED);
            assertThat(response.getCurrentParticipants()).isEqualTo(4); // 5 -> 4
        }

        @Test
        @DisplayName("성공: CLOSED 상태에서 취소 발생 시 인원이 비면 OPEN으로 변경된다")
        void cancel_success_reopen() {
            // given
            int memberId = 1;
            UUID applyId = UUID.randomUUID();
            UUID coopostId = UUID.randomUUID();

            // 10/10명 꽉 찬 상태
            Coopost coopost = createCoopost(createMember(2), 10, 10, CoopostStatus.CLOSED);
            coopost.setCoopostId(coopostId);

            CoopostMember apply = CoopostMember.builder()
                    .coopost(coopost)
                    .member(createMember(memberId))
                    .status(ApplyStatus.ACTIVE)
                    .build();

            given(applyRepository.findByIdAndMemberId(applyId, memberId)).willReturn(Optional.of(apply));
            given(coopostRepository.getByIdWithLock(coopostId)).willReturn(coopost);

            // when
            applyService.cancel(memberId, applyId);

            // then
            assertThat(coopost.getCurrentParticipants()).isEqualTo(9);
            assertThat(coopost.getStatus()).isEqualTo(CoopostStatus.OPEN); // CLOSED -> OPEN
        }

        @Test
        @DisplayName("실패: 이미 취소된(CANCELED) 신청은 다시 취소할 수 없다")
        void cancel_fail_already_canceled() {
            // given
            int memberId = 1;
            UUID applyId = UUID.randomUUID();

            CoopostMember apply = CoopostMember.builder()
                    .coopost(mock(Coopost.class))
                    .member(createMember(memberId))
                    .status(ApplyStatus.CANCELED) // 이미 취소됨
                    .build();

            given(applyRepository.findByIdAndMemberId(applyId, memberId)).willReturn(Optional.of(apply));

            // when & then
            assertThatThrownBy(() -> applyService.cancel(memberId, applyId))
                    .isInstanceOf(NeighborsException.class)
                    .hasMessage(ErrorCode.ALREADY_CANCELED.getMessage());
        }

        @Test
        @DisplayName("실패: 존재하지 않는 신청 내역은 취소할 수 없다")
        void cancel_fail_not_found() {
            // given
            int memberId = 1;
            UUID applyId = UUID.randomUUID();

            given(applyRepository.findByIdAndMemberId(applyId, memberId)).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> applyService.cancel(memberId, applyId))
                    .isInstanceOf(NeighborsException.class)
                    .hasMessage(ErrorCode.APPLICATION_NOT_FOUND.getMessage());
        }
    }
}