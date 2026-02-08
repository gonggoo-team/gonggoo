package com.gonggoo.gonggoo.coopost.service;

import com.gonggoo.gonggoo.coopost.domain.ApplyStatus;
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

        validatePostCondition(coopost, memberId);

        CoopostMember apply = handleApplyOrCreate(coopost, member);
        coopost.addParticipant();
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

        // 이미 취소된 상태인지 확인
        if (apply.getStatus() == ApplyStatus.CANCELED) {
            throw new NeighborsException(ErrorCode.ALREADY_CANCELED);
        }

        //상태 변경
        apply.cancel();

        // 인원 감소 및 공구글 상태(OPEN/CLOSED) 동기화
        Coopost coopost = findCoopostWithLock(apply.getCoopost().getCoopostId());
        coopost.removeParticipant();

        return ApplyResponse.builder()
                .applyId(applyId)
                .coopostId(coopost.getCoopostId())
                .currentParticipants(coopost.getCurrentParticipants())
                .message("공구 신청이 취소되었습니다.")
                .build();
    }

    // 신청 처리 로직(Create vs Update 분기 처리)
    private CoopostMember handleApplyOrCreate(Coopost coopost, Member member) {
        return applyRepository.findByCoopostAndMember(coopost, member)
                .map(existingApply -> {
                    // 이미 데이터가 존재함
                    if (existingApply.isActive()) {
                        // 이미 활동 중이면 중복 신청 에러
                        throw new NeighborsException(ErrorCode.ALREADY_APPLIED);
                    }
                    // 취소 상태라면 다시 ACTIVE로 부활 (재신청)
                    existingApply.reApply();
                    return existingApply;
                })
                .orElseGet(() -> {
                    // 데이터가 없으면 새로 생성
                    CoopostMember newApply = CoopostMember.builder()
                            .coopost(coopost)
                            .member(member)
                            .status(ApplyStatus.ACTIVE)
                            .build();
                    return applyRepository.save(newApply);
                });
    }

    // 내가 신청한 목록 조회
    @Transactional(readOnly = true)
    public SliceResponse<MyApplyResponse> getMyApplyList(int memberId, Pageable pageable) {
        Slice<CoopostMember> slice = applyRepository.findMyApplyList(memberId, pageable);
        return SliceResponse.of(slice, MyApplyResponse::from);
    }



    // ==== helper methods ==

    // 조회 관련 helper methods

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

    // 검증 Helper
    private void validatePostCondition(Coopost coopost, int memberId) {
        if (coopost.getMember().getId() == memberId) throw new NeighborsException(ErrorCode.CANNOT_APPLY_OWN_POST);
        if (coopost.getStatus() != CoopostStatus.OPEN) throw new NeighborsException(ErrorCode.COOPOST_CLOSED);
        if (coopost.getCurrentParticipants() >= coopost.getMaxParticipants()) throw new NeighborsException(ErrorCode.COOPOST_FULL);
    }
}