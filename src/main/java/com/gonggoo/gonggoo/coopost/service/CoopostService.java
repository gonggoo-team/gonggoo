package com.gonggoo.gonggoo.coopost.service;


import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostCreateRequest;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostSearchCondition;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostUpdateRequest;
import com.gonggoo.gonggoo.coopost.dto.response.CoopostResponse;
import com.gonggoo.gonggoo.coopost.dto.response.SliceResponse;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.UUID;

public interface CoopostService {

    CoopostResponse create(CoopostCreateRequest req, int memberId);


    CoopostResponse getById(UUID coopostId, boolean increaseView);
    CoopostResponse getDetailById(UUID coopostId, Integer memberId);
    CoopostResponse update(UUID coopostId, CoopostUpdateRequest req);

    void delete(UUID coopostId);
    CoopostResponse changeStatus(UUID coopostId, CoopostStatus status);


    // --- Slice 기반 커서 페이지네이션 API ---

    //전체 조회
    SliceResponse<CoopostResponse> getAll(LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable);

    //내가 쓴 글 조회
    SliceResponse<CoopostResponse> getMyPosts(int memberId, LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable);

    //인기 글 조회
    SliceResponse<CoopostResponse> getPopular(Long viewCountCursor, UUID idCursor, Pageable pageable);

    //기본 검색
    SliceResponse<CoopostResponse> search(String keyword, CoopostCategory category, String location,
                                          LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable);
    //통합 검색(필터, 정렬, 커서)
    SliceResponse<CoopostResponse> searchByCondition(CoopostSearchCondition condition,
                                                     Object cursorValue, UUID cursorId, Pageable pageable);

    //실시간 필터링 결과 개수 조회
    Long countByCondition(CoopostSearchCondition condition);

}