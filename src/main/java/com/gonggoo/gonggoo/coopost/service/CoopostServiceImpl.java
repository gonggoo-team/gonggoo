package com.gonggoo.gonggoo.coopost.service;

import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.domain.CoopostMember;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostCreateRequest;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostSearchCondition;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostUpdateRequest;
import com.gonggoo.gonggoo.coopost.dto.response.CoopostResponse;
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

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CoopostServiceImpl implements CoopostService {

    private final CoopostRepository repo;
    private final MemberRepository memberRepository;
    private final CoopostMemberRepository applyRepository;
    // 공구글 생성
    @Override
    public CoopostResponse create(CoopostCreateRequest req, int memberId) {
        Member author = memberRepository.findById(memberId)
                .orElseThrow(() -> new NeighborsException(ErrorCode.MEMBER_NOT_FOUND));
    Coopost entity = Coopost.builder()
            .member(author)
            .title(req.getTitle())
            .content(req.getContent())
            .status(CoopostStatus.OPEN)
            .pricePerUnit(req.getPricePerUnit())
            .minParticipants(req.getMinParticipants())
            .maxParticipants(req.getMaxParticipants())
            .currentParticipants(1)
            .category(Optional.ofNullable(req.getCategory()).orElse(CoopostCategory.ELSE))
            .location(req.getLocation())
            .deadlineAt(req.getDeadlineAt())
            .viewCount(0)
            .build();
        return CoopostResponse.from(repo.save(entity));
    }

    // 공구글 상세 조회
    @Override
    @Transactional // 더티 체킹을 위해 readOnly 제거 혹은 별도 메서드 분리
    public CoopostResponse getById(UUID coopostId, boolean increaseView) {
        Coopost e = repo.findById(coopostId)
                .orElseThrow(() -> new NeighborsException(ErrorCode.COOPOST_NOT_FOUND));
        if (increaseView) {
            e.increaseViewCount();
        }
        return CoopostResponse.from(e);
    }
    @Override
    @Transactional // 조회수 증가(Update) 때문에 readonly 아님
    public CoopostResponse getDetailById(UUID coopostId, Integer memberId) {
        Coopost e = repo.findById(coopostId)
                .orElseThrow(() -> new NeighborsException(ErrorCode.COOPOST_NOT_FOUND));

        // 1. 조회수 증가
        e.increaseViewCount();

        // 2. 로그인 유저라면 신청 상태 확인
        boolean isApplied = false;
        UUID myApplyId = null;

        if (memberId != null && memberId != 0) {
            Optional<CoopostMember> apply = applyRepository.findByCoopostCoopostIdAndMemberId(coopostId, memberId);
            if (apply.isPresent()) {
                isApplied = true;
                myApplyId = apply.get().getId();
            }
        }

        // 3. 응답 반환
        return CoopostResponse.from(e, isApplied, myApplyId);
    }

    // 공구글 업데이트
    @Override
    public CoopostResponse update(UUID coopostId, CoopostUpdateRequest req) {
        Coopost e = repo.findById(coopostId)
                .orElseThrow(() -> new NeighborsException(ErrorCode.COOPOST_NOT_FOUND));

        // [변경] 일일이 null 체크하던 로직을 Entity 내부 메서드로 위임
        e.updateInfo(req);

        return CoopostResponse.from(e);
    }

    // 공구글 삭제 (Soft Delete)
    @Override
    public void delete(UUID coopostId) {
        Coopost coopost = repo.findById(coopostId)
                .orElseThrow(() -> new NeighborsException(ErrorCode.COOPOST_NOT_FOUND));

        coopost.softDelete();

    }

    //공구글 상태 변경
    @Override
    public CoopostResponse changeStatus(UUID coopostId, CoopostStatus status) {
        Coopost e = repo.findById(coopostId)
                .orElseThrow(() -> new NeighborsException(ErrorCode.COOPOST_NOT_FOUND));
        e.changeStatus(status);
        return CoopostResponse.from(e);
    }



    // --- Slice 기반 커서 페이지네이션 API ---

    // 전체 공구글 조회
    @Override
    @Transactional(readOnly = true)
    public SliceResponse<CoopostResponse> getAll(LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable) {
        Slice<Coopost> slice;
        if (createdAtCursor == null || idCursor == null) {
            // 3. Repository 메소드 이름 변경에 따라 수정
            slice = repo.findByDeletedAtIsNullOrderByCreatedAtDescCoopostIdDesc(pageable);
        } else {
            slice = repo.findNextPage(createdAtCursor, idCursor, pageable);
        }
        return SliceResponse.of(slice, CoopostResponse::from);
    }

    // 내가 쓴 공구글 조회
    @Override
    @Transactional(readOnly = true)
    public SliceResponse<CoopostResponse> getMyPosts(int memberId, LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable) {
        Slice<Coopost> slice = repo.findMyPosts(memberId, createdAtCursor, idCursor, pageable);
        return SliceResponse.of(slice, CoopostResponse::from);
    }

    // 인기 공구글 조회
    @Override
    @Transactional(readOnly = true)
    public SliceResponse<CoopostResponse> getPopular(Long viewCountCursor, UUID idCursor, Pageable pageable) {
        Slice<Coopost> slice = repo.findPopular(viewCountCursor, idCursor, pageable);
        return SliceResponse.of(slice, CoopostResponse::from);
    }

    // 공구글 검색
    @Override
    @Transactional(readOnly = true)
    public SliceResponse<CoopostResponse> search(String keyword, CoopostCategory category, String location,
                                                 LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable) {
        Slice<Coopost> slice = repo.search(keyword, category, location, createdAtCursor, idCursor, pageable);
        return SliceResponse.of(slice, CoopostResponse::from);
    }

    //통합 검색
    @Override
    @Transactional(readOnly = true)
    public SliceResponse<CoopostResponse> searchByCondition(CoopostSearchCondition cond,
                                                            Object cursorValue, UUID cursorId,
                                                            Pageable pageable) {
        Slice<Coopost> slice = repo.searchByCondition(cond, cursorValue, cursorId, pageable);

        return SliceResponse.of(slice, CoopostResponse::from);

    }

    @Override
    @Transactional(readOnly = true)
    public Long countByCondition(CoopostSearchCondition condition) {
        return repo.countByCondition(condition);
    }
}