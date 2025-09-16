package com.gonggoo.gonggoo.controller;

import com.gonggoo.gonggoo.dto.request.CoopostCreateRequest;
import com.gonggoo.gonggoo.dto.request.CoopostStatusUpdateRequest;
import com.gonggoo.gonggoo.dto.request.CoopostUpdateRequest;
import com.gonggoo.gonggoo.dto.response.CoopostResponse;
import com.gonggoo.gonggoo.dto.response.PageResponse;
import com.gonggoo.gonggoo.global.response.ApiResponse;
import com.gonggoo.gonggoo.service.CoopostService;
import jakarta.validation.Valid;
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

    // 공구글 생성 (201 Created)
    @PostMapping
    public ApiResponse<CoopostResponse> create(@Valid @RequestBody CoopostCreateRequest req) {
        // HttpStatus와 함께 데이터를 담아 성공 응답 반환
        return ApiResponse.success(HttpStatus.CREATED, "공구글이 성공적으로 생성되었습니다.", service.create(req));
    }
    // 공구글 전체 조회 (기본 최신순)
    @GetMapping
    public ApiResponse<PageResponse<CoopostResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,DESC") String sort
    ) {
        Pageable pageable = buildPageable(page, size, sort);
        return ApiResponse.success(service.getAll(pageable));
    }

    // 공구글 상세 조회 (조회수 +1)
    @GetMapping("/{coopostId}")
    public ApiResponse<CoopostResponse> getById(@PathVariable UUID coopostId) {
        return ApiResponse.success(service.getById(coopostId, true));
    }

    // 공구글 수정 (PATCH)
    @PatchMapping("/{coopostId}")
    public ApiResponse<CoopostResponse> update(@PathVariable UUID coopostId,
                                               @Valid @RequestBody CoopostUpdateRequest req) {
        return ApiResponse.success(service.update(coopostId, req));
    }

    // 공구글 삭제 (204 No Content)
    @DeleteMapping("/{coopostId}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 내용 없는 성공 응답이므로 그대로 유지
    public void delete(@PathVariable UUID coopostId) {
        service.delete(coopostId);
    }

    // 공구글 상태 변경
    @PatchMapping("/{coopostId}/status")
    public ApiResponse<CoopostResponse> changeStatus(@PathVariable UUID coopostId,
                                                     @RequestBody CoopostStatusUpdateRequest req) {
        return ApiResponse.success(service.changeStatus(coopostId, req.getStatus()));
    }

    // 내가 쓴 공구글
    @GetMapping("/myposts")
    public ApiResponse<PageResponse<CoopostResponse>> myPosts(
            @RequestParam UUID authorId, // JWT 붙이면 제거하고 SecurityContext에서 추출
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,DESC") String sort
    ) {
        Pageable pageable = buildPageable(page, size, sort);
        return ApiResponse.success(service.getMyPosts(authorId, pageable));
    }

    // 인기 공구글 (조회수 기준)
    @GetMapping("/popular")
    public ApiResponse<PageResponse<CoopostResponse>> popular(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "viewCount"));
        return ApiResponse.success(service.getPopular(pageable));
    }

    // 공구글 검색
    @GetMapping("/search")
    public ApiResponse<PageResponse<CoopostResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location, // 'location' 파라미터 추가
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,DESC") String sort
    ) {
        Pageable pageable = buildPageable(page, size, sort);
        return ApiResponse.success(service.search(keyword, category, location, pageable));
    }

    private Pageable buildPageable(int page, int size, String sortParam) {
        String[] tokens = sortParam.split(",");
        String prop = tokens[0];
        Sort.Direction dir = (tokens.length > 1 && "ASC".equalsIgnoreCase(tokens[1]))
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(page, size, Sort.by(dir, prop));
    }
}