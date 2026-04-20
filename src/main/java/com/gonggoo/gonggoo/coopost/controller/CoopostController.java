package com.gonggoo.gonggoo.coopost.controller;

import com.gonggoo.gonggoo.auth.dto.CustomPrincipal;
import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostCreateRequest;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostSearchCondition;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostStatusUpdateRequest;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostUpdateRequest;
import com.gonggoo.gonggoo.coopost.dto.response.CoopostResponse;
import com.gonggoo.gonggoo.coopost.dto.response.SliceResponse;
import com.gonggoo.gonggoo.global.response.ApiResponse;
import com.gonggoo.gonggoo.coopost.service.CoopostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Tag(name = "공구글 (Coopost)", description = "공구글 API 명세")
@RestController
@RequestMapping("/api/coopost/v1")
@RequiredArgsConstructor
public class CoopostController {

    private final CoopostService service;

    /**
     * 공구글 생성 (201 Created)
     */
    @Operation(summary = "공구글 생성")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CoopostResponse> create(
            @Valid @RequestBody CoopostCreateRequest req,
            @AuthenticationPrincipal CustomPrincipal principal) {

        return ApiResponse.success(HttpStatus.CREATED,
                "공구글이 성공적으로 생성되었습니다.",
                service.create(req, principal.memberId()));
    }

    /**
     * 공구글 상세 조회 (200 OK)
     * 로그인한 유저라면 isApplied=true, myApplyId=... 반환
     * 비로그인 유저라면 isApplied=false, myApplyId=null 반환
     */
    @Operation(summary = "공구글 상세 조회")
    @GetMapping("/{coopostId}")
    public ApiResponse<CoopostResponse> getById(
            @PathVariable UUID coopostId,
            @AuthenticationPrincipal CustomPrincipal principal
    ) {
        Integer memberId = principal != null ? principal.memberId() : null;
        return ApiResponse.success(service.getDetailById(coopostId, memberId));
    }

    /**
     * 공구글 수정 (200 OK)
     */
    @Operation(summary = "공구글 수정")
    @PatchMapping("/{coopostId}")
    public ApiResponse<CoopostResponse> update(@PathVariable UUID coopostId,
                                               @Valid @RequestBody CoopostUpdateRequest req) {
        return ApiResponse.success(service.update(coopostId, req));
    }

    /**
     * 공구글 삭제 (204 No Content)
     * 204 응답은 본문(body)이 없으므로 ApiResponse를 사용하지 않는 것이 표준적입니다.
     */
    @Operation(summary = "공구글 삭제")
    @DeleteMapping("/{coopostId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID coopostId) {
        service.delete(coopostId);
    }

    /**
     * 공구글 상태 변경 (200 OK)
     */
    @Operation(summary = "공구글 상태 변경")
    @PatchMapping("/{coopostId}/status")
    public ApiResponse<CoopostResponse> changeStatus(@PathVariable UUID coopostId,
                                                     @RequestBody CoopostStatusUpdateRequest req) {
        return ApiResponse.success(service.changeStatus(coopostId, req.getStatus()));
    }
// --- Slice 기반 커서 페이지네이션 엔드포인트 ---

    /**
     * 공구글 전체 조회 (200 OK)
     */
    @Operation(summary = "공구글 전체 조회")
    @GetMapping("/all")
    public ApiResponse<SliceResponse<CoopostResponse>> getAll(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAtCursor,
            @RequestParam(required = false) UUID idCursor,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(0, size, Sort.by(
                Sort.Order.desc("createdAt"),
                Sort.Order.desc("coopostId")
        ));
        return ApiResponse.success(service.getAll(createdAtCursor, idCursor, pageable));
    }

    /**
     * 내가 쓴 공구글 조회 (200 OK)
     */
    @Operation(summary = "내가 쓴 공구글 조회")
    @GetMapping("/myposts")
    public ApiResponse<SliceResponse<CoopostResponse>> myPosts(
            @AuthenticationPrincipal CustomPrincipal principal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAtCursor,
            @RequestParam(required = false) UUID idCursor,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(0, size, Sort.by(
                Sort.Order.desc("createdAt"),
                Sort.Order.desc("coopostId")
        ));
        return ApiResponse.success(service.getMyPosts(principal.memberId(), createdAtCursor, idCursor, pageable));
    }

    /**
     * 인기 공구글 조회 (200 OK)
     */
    @Operation(summary = "인기 공구글 조회")
    @GetMapping("/popular")
    public ApiResponse<SliceResponse<CoopostResponse>> popular(
            @RequestParam(required = false) Long viewCountCursor,
            @RequestParam(required = false) UUID idCursor,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(0, size, Sort.by(
                Sort.Order.desc("viewCount"),
                Sort.Order.desc("coopostId")
        ));
        return ApiResponse.success(service.getPopular(viewCountCursor, idCursor, pageable));
    }

    /**
     * 공구글 검색 (200 OK)
     */
    @Operation(summary = "공구글 검색")
    @GetMapping("/search")
    public ApiResponse<SliceResponse<CoopostResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) CoopostCategory category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAtCursor,
            @RequestParam(required = false) UUID idCursor,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(0, size, Sort.by(
                Sort.Order.desc("createdAt"),
                Sort.Order.desc("coopostId")
        ));
        return ApiResponse.success(service.search(keyword, category, location, createdAtCursor, idCursor, pageable));
    }

    // ===================
    // 통합 상세 검색, 필터링
    // ===================
    /**
     * 통합 검색 API
     * * [Frontend 요청 가이드]
     * URL 예시: /api/coopost/v1/search/filter
     * * 1. 기본 검색:
     * ?keyword=사과&category=FOOD&location=서울
     * * 2. 필터 적용 (가격, 상태, 슬롯):
     * ?minPrice=1000&maxPrice=5000
     * ?statuses=OPEN&statuses=CLOSED  (List는 파라미터 반복)
     * ?slots=1-2&slots=3-4            (1~2명 혹은 3~4명 모집)
     * ?excludeCompleted=true          (모집 완료된 글 제외)
     * ?deadlineToday=true             (오늘 마감인 글만)
     * * 3. 정렬 기준 (sortBy):
     * ?sortBy=LATEST   (최신순 - 기본값)
     * ?sortBy=POPULAR  (인기순)
     * ?sortBy=DEADLINE (마감임박순)
     * ?sortBy=OLDEST   (오래된순)
     * * 4. 커서 페이지네이션 (무한 스크롤):
     * 첫 페이지: cursor 파라미터 없이 요청
     * 다음 페이지: 응답받은 slice.content의 마지막 요소의 값으로 요청
     * - sortBy=POPULAR 인 경우: ?cursor=150 (마지막 글의 viewCount) & idCursor=UUID
     * - 그 외 경우: ?cursor=2024-11-22T10:00:00 (마지막 글의 날짜) & idCursor=UUID
     */
    @Operation(summary = "통합 검색")
    @GetMapping("/search/filter")
    public ApiResponse<SliceResponse<CoopostResponse>> searchByCondition(
            @ModelAttribute CoopostSearchCondition condition,
            @RequestParam(required=false) String cursor,
            @RequestParam(required = false) UUID idCursor,
            @RequestParam(defaultValue = "20") int size
            ) {
        Object parsedCursor = null;

        if (cursor != null && !cursor.isBlank()) {
            if ("POPULAR".equalsIgnoreCase(condition.getSortBy())) {
                // 인기순 정렬일 때는 커서가 Long 타입(조회수)
                try {
                    parsedCursor = Long.parseLong(cursor);
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException("인기순 정렬의 커서는 숫자여야 합니다.");
                }
            } else {
                // 최신순(LATEST), 마감순(DEADLINE), 오래된순(OLDEST)일 때는 커서가 LocalDateTime 타입
                try {
                    parsedCursor = LocalDateTime.parse(cursor);
                } catch (Exception e) {
                    throw new IllegalArgumentException("날짜 형식이 올바르지 않습니다. (ISO-8601 형식 요망)");
                }
            }
        }

        // 2. Pageable 생성 (size만 사용, 정렬은 QueryDSL에서 처리하므로 여기선 임의값)
        Pageable pageable = PageRequest.of(0, size);

        // 3. 서비스 호출
        return ApiResponse.success(service.searchByCondition(condition, parsedCursor, idCursor, pageable));
    }
}







//
//    // 공구글 생성 (201 Created)
//    @PostMapping
//    public ApiResponse<CoopostResponse> create(@Valid @RequestBody CoopostCreateRequest req) {
//        // HttpStatus와 함께 데이터를 담아 성공 응답 반환
//        return ApiResponse.success(HttpStatus.CREATED, "공구글이 성공적으로 생성되었습니다.", service.create(req));
//    }
//    // 공구글 전체 조회 (기본 최신순)
//    @GetMapping
//    public ApiResponse<PageResponse<CoopostResponse>> getAll(
//            // int page 대신 LocalDateTime cursor를 받도록 변경
//            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime cursor,
//            @RequestParam(defaultValue = "20") int size
//    ) {
//        // 정렬은 항상 최신순(createdAt DESC)으로 고정
//        Pageable pageable = PageRequest.of(0, size, Sort.by(Sort.Direction.DESC, "createdAt"));
//        return ApiResponse.success(service.getAll(cursor, pageable));
//    }
//
//    // 공구글 상세 조회 (조회수 +1)
//    @GetMapping("/{coopostId}")
//    public ApiResponse<CoopostResponse> getById(@PathVariable UUID coopostId) {
//        return ApiResponse.success(service.getById(coopostId, true));
//    }
//
//    // 공구글 수정 (PATCH)
//    @PatchMapping("/{coopostId}")
//    public ApiResponse<CoopostResponse> update(@PathVariable UUID coopostId,
//                                               @Valid @RequestBody CoopostUpdateRequest req) {
//        return ApiResponse.success(service.update(coopostId, req));
//    }
//
//    // 공구글 삭제 (204 No Content)
//    @DeleteMapping("/{coopostId}")
//    @ResponseStatus(HttpStatus.NO_CONTENT) // 내용 없는 성공 응답이므로 그대로 유지
//    public void delete(@PathVariable UUID coopostId) {
//        service.delete(coopostId);
//    }
//
//    // 공구글 상태 변경
//    @PatchMapping("/{coopostId}/status")
//    public ApiResponse<CoopostResponse> changeStatus(@PathVariable UUID coopostId,
//                                                     @RequestBody CoopostStatusUpdateRequest req) {
//        return ApiResponse.success(service.changeStatus(coopostId, req.getStatus()));
//    }
//
//    // 내가 쓴 공구글
//    @GetMapping("/myposts")
//    public ApiResponse<PageResponse<CoopostResponse>> myPosts(
//            @RequestParam UUID authorId, // JWT 적용 후 SecurityContext에서 추출
//            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime cursor,
//            @RequestParam(defaultValue = "20") int size
//    ) {
//        // 정렬은 항상 최신순으로 고정
//        Pageable pageable = PageRequest.of(0, size, Sort.by(Sort.Direction.DESC, "createdAt"));
//        return ApiResponse.success(service.getMyPosts(authorId, cursor, pageable));
//    }
//
//    // 인기 공구글 (조회수 기준)
//    @GetMapping("/popular")
//    public ApiResponse<PageResponse<CoopostResponse>> popular(
//            @RequestParam(required = false) Long viewCountCursor,
//            @RequestParam(required = false) UUID idCursor,
//            @RequestParam(defaultValue = "10") int size
//    ) {
//        // 정렬 기준: 1. 조회수(viewCount) 내림차순, 2. ID(coopostId) 내림차순
//        Pageable pageable = PageRequest.of(0, size, Sort.by(
//                Sort.Order.desc("viewCount"),
//                Sort.Order.desc("coopostId")
//        ));
//        return ApiResponse.success(service.getPopular(viewCountCursor, idCursor, pageable));
//    }
//
//    // 공구글 검색
//    @GetMapping("/search")
//    public ApiResponse<PageResponse<CoopostResponse>> search(
//            @RequestParam(required = false) String keyword,
//            @RequestParam(required = false) CoopostCategory category,
//            @RequestParam(required = false) String location,
//            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime cursor,
//            @RequestParam(defaultValue = "20") int size
//    ) {
//        Pageable pageable = PageRequest.of(0, size, Sort.by(Sort.Direction.DESC, "createdAt"));
//        return ApiResponse.success(service.search(keyword, category, location, cursor, pageable));
//    }


