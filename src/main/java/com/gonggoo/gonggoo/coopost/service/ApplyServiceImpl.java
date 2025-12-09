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
        Member member = findMemberById(memberId);
        Coopost coopost = findCoopostWithLock(req.getCoopostId());

        validateApply(coopost, memberId);

        CoopostMember apply = saveApply(coopost, member);
        increaseParticipants(coopost);

        return ApplyResponse.builder()
                .applyId(apply.getId())
                .coopostId(coopost.getCoopostId())
                .currentParticipants(coopost.getCurrentParticipants())
                .message("공구 신청이 완료되었습니다.")
                .build();
    }


    // 공구 신청 취소
    public ApplyResponse cancel(int memberId, UUID applyId) {
        CoopostMember apply = findApplyByIdAndMemberId(applyId, memberId);
        Coopost coopost = findCoopostWithLock(apply.getCoopost().getCoopostId());

        deleteApply(apply);
        decreaseParticipants(coopost);

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

    // ==== helper methods ==
    // private

    // 1. 조회 관련 helper methods

    // ID로 멤버 찾기
    private Member findMemberById(int memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new NeighborsException(ErrorCode.MEMBER_NOT_FOUND));
    }

    // Coopost 찾기
    private Coopost findCoopostWithLock(UUID coopostId) {
        Coopost coopost = coopostRepository.getByIdWithLock(coopostId);
        if (coopost == null) {
            throw new NeighborsException(ErrorCode.COOPOST_NOT_FOUND);
        }
        return coopost;
    }

    // 본인 신청 글 applyId로 찾기
    private CoopostMember findApplyByIdAndMemberId(UUID applyId, int memberId) {
        return applyRepository.findByIdAndMemberId(applyId, memberId)
                .orElseThrow(() -> new NeighborsException(ErrorCode.APPLICATION_NOT_FOUND));
    }

    // 2. 검증 관련 helper methods
    private void validateApply(Coopost coopost, int memberId) {
        // 자신이 올린 글에는 참여 불가능
        if (coopost.getMember().getId() == memberId) {
            throw new NeighborsException(ErrorCode.CANNOT_APPLY_OWN_POST);
        }

        //이미 마감된 글 참여 불가능
        if (coopost.getStatus() != CoopostStatus.OPEN) {
            throw new NeighborsException(ErrorCode.COOPOST_CLOSED);
        }
        // 인원이 가득 찬 글 참여 불가능
        if (coopost.getCurrentParticipants() >= coopost.getMaxParticipants()) {
            throw new NeighborsException(ErrorCode.COOPOST_FULL);
        }
        // 이미 참여한 글에는 재참여 불가능
        if (applyRepository.existsByCoopostCoopostIdAndMemberId(coopost.getCoopostId(), memberId)) {
            throw new NeighborsException(ErrorCode.ALREADY_APPLIED);
        }


    }
    // 3. 저장 및 삭제
    private CoopostMember saveApply(Coopost coopost, Member member) {
        CoopostMember apply = CoopostMember.builder()
                .coopost(coopost)
                .member(member)
                .build();
        return applyRepository.save(apply);
    }

    private void deleteApply(CoopostMember apply) {
        applyRepository.delete(apply);
    }

    // 4. 상태 변경
    private void increaseParticipants(Coopost coopost) {
        coopost.setCurrentParticipants(coopost.getCurrentParticipants() + 1);
        if (coopost.getCurrentParticipants().equals(coopost.getMaxParticipants())) {
            coopost.setStatus(CoopostStatus.CLOSED);
        }
    }

    private void decreaseParticipants(Coopost coopost) {
        if (coopost.getCurrentParticipants() > 0) {
            coopost.setCurrentParticipants(coopost.getCurrentParticipants() - 1);
        }
        // 마감 상태였는데 자리가 생기면 다시 OPEN
        if (coopost.getStatus() == CoopostStatus.CLOSED
                && coopost.getCurrentParticipants() < coopost.getMaxParticipants()) {
            coopost.setStatus(CoopostStatus.OPEN);
        }
    }
}