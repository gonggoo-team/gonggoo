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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ScrapServiceImpl {

    private final ScrapRepository scrapRepository;
    private final MemberRepository memberRepository;
    private final CoopostRepository coopostRepository;

    // 스크랩 토글 (생성 or 삭제)
    public boolean toggleScrap(int memberId, ScrapCreateRequest req) {
        // 1. 이미 스크랩 되어 있는지 확인
        Optional<Scrap> existingScrap = scrapRepository.findByMemberIdAndCoopostCoopostId(memberId, req.getCoopostId());

        if (existingScrap.isPresent()) {
            // [Case 1] 이미 있으면 -> 삭제 (Un-scrap)
            scrapRepository.delete(existingScrap.get());
            return false; // 현재 상태: 스크랩 안됨
        } else {
            // [Case 2] 없으면 -> 생성 (Scrap)
            Member member = memberRepository.findById(memberId)
                    .orElseThrow(() -> new NeighborsException(ErrorCode.MEMBER_NOT_FOUND));

            Coopost coopost = coopostRepository.findById(req.getCoopostId())
                    .orElseThrow(() -> new NeighborsException(ErrorCode.COOPOST_NOT_FOUND));

            Scrap scrap = Scrap.builder()
                    .member(member)
                    .coopost(coopost)
                    .build();

            scrapRepository.save(scrap);
            return true; // 현재 상태: 스크랩 됨
        }
    }

    // 내 스크랩 조회
    @Transactional(readOnly = true)
    public SliceResponse<ScrapResponse> getMyScraps(int memberId, Pageable pageable) {
        Slice<Scrap> slice = scrapRepository.findMyScraps(memberId, pageable);
        return SliceResponse.of(slice, ScrapResponse::from);
    }
}