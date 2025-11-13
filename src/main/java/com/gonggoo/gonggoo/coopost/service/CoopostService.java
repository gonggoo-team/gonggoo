package com.gonggoo.gonggoo.coopost.service;


import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostCreateRequest;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostUpdateRequest;
import com.gonggoo.gonggoo.coopost.dto.response.CoopostResponse;
import com.gonggoo.gonggoo.coopost.dto.response.PageResponse;
import com.gonggoo.gonggoo.coopost.dto.response.SliceResponse;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.UUID;

public interface CoopostService {

    CoopostResponse create(CoopostCreateRequest req);


    CoopostResponse getById(UUID coopostId, boolean increaseView);

    CoopostResponse update(UUID coopostId, CoopostUpdateRequest req);

    void delete(UUID coopostId);
    CoopostResponse changeStatus(UUID coopostId, CoopostStatus status);


    // --- Slice 기반 커서 페이지네이션 API ---

    /**
     * 전체 게시글 조회
     */
    SliceResponse<CoopostResponse> getAll(LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable);

    /**
     * 내가 쓴 게시글 조회
     */
    SliceResponse<CoopostResponse> getMyPosts(int authorId, LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable);

    /**
     * 인기 게시글 조회
     */
    SliceResponse<CoopostResponse> getPopular(Long viewCountCursor, UUID idCursor, Pageable pageable);

    /**
     * 게시글 검색
     */
    SliceResponse<CoopostResponse> search(String keyword, CoopostCategory category, String location,
                                          LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable);
}