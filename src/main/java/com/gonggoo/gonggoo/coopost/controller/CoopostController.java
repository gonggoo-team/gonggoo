package com.gonggoo.gonggoo.coopost.controller;

import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostCreateRequest;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostStatusUpdateRequest;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostUpdateRequest;
import com.gonggoo.gonggoo.coopost.dto.response.CoopostResponse;
import com.gonggoo.gonggoo.coopost.dto.response.PageResponse;
import com.gonggoo.gonggoo.coopost.dto.response.SliceResponse;
import com.gonggoo.gonggoo.global.response.ApiResponse;
import com.gonggoo.gonggoo.coopost.service.CoopostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/coopost/v1")
@RequiredArgsConstructor
public class CoopostController {

    private final CoopostService service;
    private final JwtTokenProvider jwtTokenProvider;
    /**
     * 공구글 생성 (201 Created)
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CoopostResponse> create(
            @Valid @RequestBody CoopostCreateRequest req,
            @RequestHeader("Authorization") String authorizationHeader) {

        String accessToken = authorizationHeader.split(" ")[1];
        int memberId = Integer.parseInt(jwtTokenProvider.parseSubject(accessToken));


        return ApiResponse.success(HttpStatus.CREATED,
                "공구글이 성공적으로 생성되었습니다.",
                service.create(req, memberId));
    }

    /**
     * 공구글 상세 조회 (200 OK)
     */
    @GetMapping("/{coopostId}")
    public ApiResponse<CoopostResponse> getById(@PathVariable UUID coopostId) {
        // ApiResponse.success(data) -> "OK" 메시지와 함께 200 상태 코드로 응답
        return ApiResponse.success(service.getById(coopostId, true));
    }

    /**
     * 공구글 수정 (200 OK)
     */
    @PatchMapping("/{coopostId}")
    public ApiResponse<CoopostResponse> update(@PathVariable UUID coopostId,
                                               @Valid @RequestBody CoopostUpdateRequest req) {
        return ApiResponse.success(service.update(coopostId, req));
    }

    /**
     * 공구글 삭제 (204 No Content)
     * 204 응답은 본문(body)이 없으므로 ApiResponse를 사용하지 않는 것이 표준적입니다.
     */
    @DeleteMapping("/{coopostId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID coopostId) {
        service.delete(coopostId);
    }

    /**
     * 공구글 상태 변경 (200 OK)
     */
    @PatchMapping("/{coopostId}/status")
    public ApiResponse<CoopostResponse> changeStatus(@PathVariable UUID coopostId,
                                                     @RequestBody CoopostStatusUpdateRequest req) {
        return ApiResponse.success(service.changeStatus(coopostId, req.getStatus()));
    }
// --- Slice 기반 커서 페이지네이션 엔드포인트 ---

    /**
     * 공구글 전체 조회 (200 OK)
     */
    @GetMapping
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
    @GetMapping("/myposts")
    public ApiResponse<SliceResponse<CoopostResponse>> myPosts(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAtCursor,
            @RequestParam(required = false) UUID idCursor,
            @RequestParam(defaultValue = "20") int size
    ) {

        String accessToken = authorizationHeader.split(" ")[1];
        int memberId = Integer.parseInt(jwtTokenProvider.parseSubject(accessToken));


        Pageable pageable = PageRequest.of(0, size, Sort.by(
                Sort.Order.desc("createdAt"),
                Sort.Order.desc("coopostId")
        ));
        return ApiResponse.success(service.getMyPosts(memberId, createdAtCursor, idCursor, pageable));
    }

    /**
     * 인기 공구글 조회 (200 OK)
     */
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


}