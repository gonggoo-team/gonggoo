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

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplyService2 {

    @InjectMocks
    private ApplyServiceImpl applyService;

    @Mock
    private CoopostMemberRepository applyRepository;

    @Mock
    private CoopostRepository coopostRepository;

    @Mock
    private MemberRepository memberRepository;

    // --- Helper for Test Data ---

    // ✅ [수정 1] leninent()를 사용하여 UnnecessaryStubbingException 방지
    private Member createMember(int id) {
        Member member = mock(Member.class);
        // 이 멤버가 작성자(Author)로 쓰일 땐 getId()가 호출되지만, 신청자(Applicant)일 땐 호출 안 될 수 있음
        // 따라서 유연하게(lenient) 설정
        lenient().when(member.getId()).thenReturn(id);
        return member;
    }

    private Coopost createCoopost(Member author, int current, int max, CoopostStatus status) {
        // 엔티티는 Mock 대신 실제 객체나 Builder를 쓰는 게 좋지만,
        // 로직 흐름상 author.getId() 호출 등을 위해 Mock과 섞어 씀
        Coopost coopost = new Coopost(); // 혹은 Builder
        coopost.setCoopostId(UUID.randomUUID());
        coopost.setMember(author);
        coopost.setTitle("테스트 공구");
        coopost.setStatus(status);
        coopost.setCurrentParticipants(current);
        coopost.setMaxParticipants(max);
        return coopost;
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

            // ✅ [수정 2] Mock 생성을 given() 밖으로 빼서 명확하게 분리
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

            // save 호출 시 객체 반환 (ArgumentCaptor 대신 간단하게 처리)
            given(applyRepository.save(any(CoopostMember.class))).willAnswer(invocation -> {
                CoopostMember saved = invocation.getArgument(0);
                return saved;
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
            Member author = createMember(2);
            Coopost coopost = createCoopost(author, 5, 10, CoopostStatus.OPEN);
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
            verify(applyRepository, never()).save(any(CoopostMember.class));
        }

        @Test
        @DisplayName("성공: 신청으로 인해 정원이 가득 차면 공구 상태가 CLOSED로 변경된다")
        void apply_success_close_post() {
            // given
            int memberId = 1;
            UUID coopostId = UUID.randomUUID();
            Member applicant = createMember(memberId);
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
            assertThat(coopost.getStatus()).isEqualTo(CoopostStatus.CLOSED);
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
            // ✅ Mock 객체 생성 분리 (UnfinishedStubbingException 방지)
            Member applicant = createMember(memberId);
            Member author = createMember(2);
            Coopost coopost = createCoopost(author, 10, 10, CoopostStatus.CLOSED);
            coopost.setCoopostId(coopostId);

            ApplyRequest req = new ApplyRequest();
            req.setCoopostId(coopostId);

            given(memberRepository.findById(memberId)).willReturn(Optional.of(applicant));
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

            // Mock Cooost 사용 시 주의 (여기선 그냥 Builder 사용)
            Coopost coopost = createCoopost(createMember(2), 5, 10, CoopostStatus.OPEN);

            CoopostMember apply = CoopostMember.builder()
                    .coopost(coopost)
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