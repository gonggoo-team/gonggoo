package com.gonggoo.gonggoo.controller;

import com.gonggoo.gonggoo.dto.request.CoopostCreateRequest;
import com.gonggoo.gonggoo.dto.request.CoopostStatusUpdateRequest;
import com.gonggoo.gonggoo.dto.request.CoopostUpdateRequest;
import com.gonggoo.gonggoo.dto.response.CoopostResponse;
import com.gonggoo.gonggoo.dto.response.PageResponse;
import com.gonggoo.gonggoo.service.CoopostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/coopost/v1")
@RequiredArgsConstructor
public class CoopostController {

    private final CoopostService service;

    // 공구글 생성
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CoopostResponse create(@RequestBody CoopostCreateRequest req) {
        return service.create(req);
    }

    // 공구글 전체 조회 (기본 최신순)
    @GetMapping
    public PageResponse<CoopostResponse> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,DESC") String sort
    ) {
        Pageable pageable = buildPageable(page, size, sort);
        return service.getAll(pageable);
    }

    // 공구글 상세 조회 (조회수 +1)
    @GetMapping("/{coopostId}")
    public CoopostResponse getById(@PathVariable UUID coopostId) {
        return service.getById(coopostId, true);
    }

    // 공구글 수정 (PATCH)
    @PatchMapping("/{coopostId}")
    public CoopostResponse update(@PathVariable UUID coopostId,
                                  @RequestBody CoopostUpdateRequest req) {
        return service.update(coopostId, req);
    }

    // 공구글 삭제
    @DeleteMapping("/{coopostId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID coopostId) {
        service.delete(coopostId);
    }

    // 공구글 상태 변경
    @PatchMapping("/{coopostId}/status")
    public CoopostResponse changeStatus(@PathVariable UUID coopostId,
                                        @RequestBody CoopostStatusUpdateRequest req) {
        return service.changeStatus(coopostId, req.getStatus());
    }

    // 내가 쓴 공구글
    @GetMapping("/myposts")
    public PageResponse<CoopostResponse> myPosts(
            @RequestParam UUID authorId, // JWT 붙이면 제거하고 SecurityContext에서 추출
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,DESC") String sort
    ) {
        Pageable pageable = buildPageable(page, size, sort);
        return service.getMyPosts(authorId, pageable);
    }

    // 인기 공구글 (조회수 기준)
    @GetMapping("/popular")
    public PageResponse<CoopostResponse> popular(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "viewCount"));
        return service.getPopular(pageable);
    }

    // 공구글 검색
    @GetMapping("/search")
    public PageResponse<CoopostResponse> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,DESC") String sort
    ) {
        Pageable pageable = buildPageable(page, size, sort);
        return service.search(keyword, pageable);
    }

    private Pageable buildPageable(int page, int size, String sortParam) {
        // ex) "createdAt,DESC" 또는 "viewCount,ASC"
        String[] tokens = sortParam.split(",");
        String prop = tokens[0];
        Sort.Direction dir = (tokens.length > 1 && "ASC".equalsIgnoreCase(tokens[1]))
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(page, size, Sort.by(dir, prop));
    }
}