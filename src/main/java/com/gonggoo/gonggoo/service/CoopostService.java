package com.gonggoo.gonggoo.service;


import com.gonggoo.gonggoo.dto.request.CoopostCreateRequest;
import com.gonggoo.gonggoo.dto.request.CoopostUpdateRequest;
import com.gonggoo.gonggoo.dto.response.CoopostResponse;
import com.gonggoo.gonggoo.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface CoopostService {

    CoopostResponse create(CoopostCreateRequest req);

    PageResponse<CoopostResponse> getAll(Pageable pageable);

    CoopostResponse getById(UUID coopostId, boolean increaseView);

    CoopostResponse update(UUID coopostId, CoopostUpdateRequest req);

    void delete(UUID coopostId);

    CoopostResponse changeStatus(UUID coopostId, com.example.app.domain.CoopostStatus status);

    PageResponse<CoopostResponse> getMyPosts(UUID authorId, Pageable pageable);

    PageResponse<CoopostResponse> getPopular(Pageable pageable);

    PageResponse<CoopostResponse> search(String keyword, Pageable pageable);
}