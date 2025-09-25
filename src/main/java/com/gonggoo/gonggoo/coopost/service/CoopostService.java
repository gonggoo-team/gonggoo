package com.gonggoo.gonggoo.coopost.service;


import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostCreateRequest;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostUpdateRequest;
import com.gonggoo.gonggoo.coopost.dto.response.CoopostResponse;
import com.gonggoo.gonggoo.coopost.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.UUID;

public interface CoopostService {

    CoopostResponse create(CoopostCreateRequest req);


    CoopostResponse getById(UUID coopostId, boolean increaseView);

    CoopostResponse update(UUID coopostId, CoopostUpdateRequest req);

    void delete(UUID coopostId);
    CoopostResponse changeStatus(UUID coopostId, CoopostStatus status);


    PageResponse<CoopostResponse> getPopular(Long viewCountCursor, UUID idCursor, Pageable pageable);
    // Pageable만 받던 것을 cursor를 받도록 변경
    PageResponse<CoopostResponse> getAll(LocalDateTime cursor, Pageable pageable);

    // 여기도 동일하게 변경
    PageResponse<CoopostResponse> getMyPosts(UUID authorId, LocalDateTime cursor, Pageable pageable);

    // 여기도 동일하게 변경
    PageResponse<CoopostResponse> search(String keyword, String Category, String location, LocalDateTime cursor, Pageable pageable);
}