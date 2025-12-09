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
import org.springframework.test.util.ReflectionTestUtils; // ⭐ 필수 import

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplyServiceTest {

    @InjectMocks
    private ApplyServiceImpl applyService;

    @Mock
    private CoopostMemberRepository applyRepository;
    @Mock
    private CoopostRepository coopostRepository;
    @Mock
    private MemberRepository memberRepository;

    // =========================================================
    // ⭐ [핵심] Setter 없이 객체를 만드는 헬퍼 메서드들
    // =========================================================

    private Member createMember(int id) {
        Member member = Member.builder()
                .nickname("tester")
                .email("test@test.com")
                .build();
        // ID는 Setter가 없으므로 Reflection으로 강제 주입 (DB 저장 효과)
        ReflectionTestUtils.setField(member, "id", id);
        return member;
    }

    private Coopost createCoopost(UUID id, Member author, int current, int max, CoopostStatus status) {
        // 1. Builder로 상태값 설정 (Setter 대신)
        Coopost coopost = Coopost.builder()
                .member(author)
                .title("테스트 공구")
                .content("내용")
                .pricePerUnit(BigDecimal.valueOf(1000))
                .status(status)                 // 상태 설정
                .currentParticipants(current)   // 현재 인원 설정
                .maxParticipants(max)           // 최대 인원 설정
                .category(CoopostCategory.FOOD)
                .deadlineAt(LocalDateTime.now().plusDays(1))
                .viewCount(0)
                .build();

        // 2. ID는 보통 DB 생성 시 부여되므로, 테스트에선 Reflection으로 주입
        ReflectionTestUtils.setField(coopost, "coopostId", id);

        return coopost;
    }

    // 이미 존재하는 신청 내역(Mock Data) 만들기
    private CoopostMember createApply(UUID applyId, Coopost coopost, Member member, ApplyStatus status) {
        CoopostMember apply = CoopostMember.builder()
                .coopost(coopost)
                .member(member)
                .status(status)
                .build();

        ReflectionTestUtils.setField(apply, "id", applyId);
        return apply;
    }

    @Nested
    @DisplayName("공구 신청 테스트")
    class ApplyTest {

        @Test
        @DisplayName("성공: 최초 신청 시 인원이 1 증가한다")
        void apply_success_new() {
            // given
            int memberId = 1;
            int authorId = 2; // 작성자는 다름
            UUID coopostId = UUID.randomUUID();

            Member applicant = createMember(memberId);
            Member author = createMember(authorId);

            // Setter 없이 Builder로 초기 상태(0/10, OPEN) 생성
            Coopost coopost = createCoopost(coopostId, author, 0, 10, CoopostStatus.OPEN);

            ApplyRequest req = new ApplyRequest();
            req.setCoopostId(coopostId);

            // mocking
            given(memberRepository.findById(memberId)).willReturn(Optional.of(applicant));
            given(coopostRepository.getByIdWithLock(coopostId)).willReturn(coopost);
            given(applyRepository.findByCoopostAndMember(coopost, applicant)).willReturn(Optional.empty());

            // save 호출 시 들어온 객체를 그대로 반환하도록 stubbing
            given(applyRepository.save(any(CoopostMember.class))).willAnswer(inv -> inv.getArgument(0));

            // when
            ApplyResponse response = applyService.apply(memberId, req);

            // then
            assertThat(response.getCurrentParticipants()).isEqualTo(1); // 0 -> 1 확인
            verify(applyRepository).save(any(CoopostMember.class));
        }

        @Test
        @DisplayName("성공: 신청으로 인해 정원이 가득 차면 CLOSED로 변경된다")
        void apply_success_close_post() {
            // given
            int memberId = 1;
            UUID coopostId = UUID.randomUUID();
            Member applicant = createMember(memberId);

            // ⭐ 9/10명인 상태로 생성
            Coopost coopost = createCoopost(coopostId, createMember(99), 9, 10, CoopostStatus.OPEN);

            ApplyRequest req = new ApplyRequest();
            req.setCoopostId(coopostId);

            given(memberRepository.findById(memberId)).willReturn(Optional.of(applicant));
            given(coopostRepository.getByIdWithLock(coopostId)).willReturn(coopost);
            given(applyRepository.findByCoopostAndMember(coopost, applicant)).willReturn(Optional.empty());
            given(applyRepository.save(any())).willAnswer(i -> i.getArgument(0));

            // when
            applyService.apply(memberId, req);

            // then
            assertThat(coopost.getCurrentParticipants()).isEqualTo(10); // 10명 도달
            assertThat(coopost.getStatus()).isEqualTo(CoopostStatus.CLOSED); // 마감 확인
        }

        @Test
        @DisplayName("성공: 취소했던(CANCELED) 내역이 있으면 재신청(ACTIVE) 처리된다")
        void apply_success_reapply() {
            // given
            int memberId = 1;
            UUID coopostId = UUID.randomUUID();
            Member applicant = createMember(memberId);
            Coopost coopost = createCoopost(coopostId, createMember(99), 5, 10, CoopostStatus.OPEN);

            // 이미 존재하지만 취소된 상태의 내역 생성
            CoopostMember existingApply = createApply(UUID.randomUUID(), coopost, applicant, ApplyStatus.CANCELED);

            ApplyRequest req = new ApplyRequest();
            req.setCoopostId(coopostId);

            given(memberRepository.findById(memberId)).willReturn(Optional.of(applicant));
            given(coopostRepository.getByIdWithLock(coopostId)).willReturn(coopost);
            given(applyRepository.findByCoopostAndMember(coopost, applicant)).willReturn(Optional.of(existingApply));

            // when
            applyService.apply(memberId, req);

            // then
            assertThat(existingApply.getStatus()).isEqualTo(ApplyStatus.ACTIVE); // 상태 변경 확인
            assertThat(coopost.getCurrentParticipants()).isEqualTo(6); // 인원 증가 확인
            verify(applyRepository, never()).save(any(CoopostMember.class)); // save 호출 안함 (Dirty Checking)
        }
    }

    @Nested
    @DisplayName("공구 취소 테스트")
    class CancelTest {

        @Test
        @DisplayName("성공: CLOSED 상태에서 취소 시 자리가 생겨 OPEN으로 변경된다")
        void cancel_success_reopen() {
            // given
            int memberId = 1;
            UUID applyId = UUID.randomUUID();
            UUID coopostId = UUID.randomUUID();
            Member applicant = createMember(memberId);

            // ⭐ 10/10명, CLOSED 상태로 생성
            Coopost coopost = createCoopost(coopostId, createMember(99), 10, 10, CoopostStatus.CLOSED);

            // 취소할 신청 내역 (ACTIVE)
            CoopostMember apply = createApply(applyId, coopost, applicant, ApplyStatus.ACTIVE);

            given(applyRepository.findByIdAndMemberId(applyId, memberId)).willReturn(Optional.of(apply));
            given(coopostRepository.getByIdWithLock(coopostId)).willReturn(coopost);

            // when
            applyService.cancel(memberId, applyId);

            // then
            assertThat(apply.getStatus()).isEqualTo(ApplyStatus.CANCELED); // 신청 상태 취소됨
            assertThat(coopost.getCurrentParticipants()).isEqualTo(9);     // 인원 줄어듦
            assertThat(coopost.getStatus()).isEqualTo(CoopostStatus.OPEN); // 공구글 다시 열림
        }
    }
}