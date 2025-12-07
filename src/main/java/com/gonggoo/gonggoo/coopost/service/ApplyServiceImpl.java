package com.gonggoo.gonggoo.coopost.service;

import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.domain.CoopostMember;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.gonggoo.gonggoo.coopost.dto.request.ApplyRequest;
import com.gonggoo.gonggoo.coopost.dto.response.ApplyResponse;
import com.gonggoo.gonggoo.coopost.dto.response.MyApplyResponse;
import com.gonggoo.gonggoo.coopost.dto.response.SliceResponse;
import com.gonggoo.gonggoo.coopost.repository.CoopostMemberRepository;
import com.gonggoo.gonggoo.coopost.repository.CoopostRepository;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import com.gonggoo.gonggoo.global.response.ErrorCode;
import com.gonggoo.gonggoo.member.domain.Member;
import com.gonggoo.gonggoo.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplyServiceImpl {

    private final CoopostMemberRepository applyRepository;
    private final CoopostRepository coopostRepository;
    private final MemberRepository memberRepository;

    // 공구 신청
    public ApplyResponse apply(int memberId, ApplyRequest req) {
        // 1. 멤버 조회
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new NeighborsException(ErrorCode.MEMBER_NOT_FOUND));

        // 2. 공구글 조회 + LOCK (비관적 락으로 동시성 제어)
        Coopost coopost = coopostRepository.getByIdWithLock(req.getCoopostId());

        // --- 검증 로직 ---
        if (coopost == null) {
            throw new NeighborsException(ErrorCode.COOPOST_NOT_FOUND);
        }
        // 본인 글 신청 불가
        if (coopost.getMember().getId() == memberId) {
            throw new NeighborsException(ErrorCode.CANNOT_APPLY_OWN_POST);
        }
        // 마감 여부 확인
        if (coopost.getStatus() != CoopostStatus.OPEN) {
            throw new NeighborsException(ErrorCode.COOPOST_CLOSED);
        }
        // 정원 초과 확인
        if (coopost.getCurrentParticipants() >= coopost.getMaxParticipants()) {
            throw new NeighborsException(ErrorCode.COOPOST_FULL);
        }
        // 중복 신청 확인
        if (applyRepository.existsByCoopostCoopostIdAndMemberId(coopost.getCoopostId(), memberId)) {
            throw new NeighborsException(ErrorCode.ALREADY_APPLIED);
        }

        // 3. 신청 처리
        CoopostMember apply = CoopostMember.builder()
                .coopost(coopost)
                .member(member)
                .build();
        applyRepository.save(apply);

        // 4. 참여 인원 증가
        coopost.setCurrentParticipants(coopost.getCurrentParticipants() + 1);

        // 5. 만약 다 찼다면 상태 CLOSED로 변경
        if (coopost.getCurrentParticipants().equals(coopost.getMaxParticipants())) {
            coopost.setStatus(CoopostStatus.CLOSED);
        }

        return ApplyResponse.builder()
                .applyId(apply.getId())
                .coopostId(coopost.getCoopostId())
                .currentParticipants(coopost.getCurrentParticipants())
                .message("공구 신청이 완료되었습니다.")
                .build();
    }

    // 공구 신청 취소
    public ApplyResponse cancel(int memberId, UUID applyId) {
        // 1. 신청 내역 조회 (본인의 신청인지 확인)
        CoopostMember apply = applyRepository.findByIdAndMemberId(applyId, memberId)
                .orElseThrow(() -> new NeighborsException(ErrorCode.APPLICATION_NOT_FOUND));

        // 2. 공구글 조회 + LOCK (인원수 감소 동시성 제어)
        Coopost coopost = coopostRepository.getByIdWithLock(apply.getCoopost().getCoopostId());

        // 3. 삭제 처리
        applyRepository.delete(apply); // Hard Delete (이력 남기려면 Soft Delete + Status 변경 고려)

        // 4. 참여 인원 감소
        if (coopost.getCurrentParticipants() > 0) {
            coopost.setCurrentParticipants(coopost.getCurrentParticipants() - 1);
        }

        // 5. 만약 가득 차서 CLOSED 였는데 한 자리가 비게 된다면? -> 다시 OPEN으로
        if (coopost.getStatus() == CoopostStatus.CLOSED
                && coopost.getCurrentParticipants() < coopost.getMaxParticipants()) {
            coopost.setStatus(CoopostStatus.OPEN);
        }

        return ApplyResponse.builder()
                .applyId(applyId)
                .coopostId(coopost.getCoopostId())
                .currentParticipants(coopost.getCurrentParticipants())
                .message("공구 신청이 취소되었습니다.")
                .build();
    }

    // 내가 신청한 목록 조회
    @Transactional(readOnly = true)
    public SliceResponse<MyApplyResponse> getMyApplyList(int memberId, Pageable pageable) {
        Slice<CoopostMember> slice = applyRepository.findMyApplyList(memberId, pageable);
        return SliceResponse.of(slice, MyApplyResponse::from);
    }
}