package com.gonggoo.gonggoo.scrap.controller;

import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import com.gonggoo.gonggoo.coopost.dto.response.SliceResponse;
import com.gonggoo.gonggoo.global.response.ApiResponse;
import com.gonggoo.gonggoo.scrap.dto.request.ScrapCreateRequest;
import com.gonggoo.gonggoo.scrap.dto.response.ScrapResponse;
import com.gonggoo.gonggoo.scrap.service.ScrapServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scrap/v1")
@RequiredArgsConstructor
public class ScrapController {

    private final ScrapServiceImpl scrapService;
    private final JwtTokenProvider jwtTokenProvider;

    // 스크랩 토글
    @PostMapping
    public ApiResponse<Boolean> toggleScrap(@RequestHeader("Authorization") String authorizationHeader,
                                            @RequestBody ScrapCreateRequest req) {
        int memberId = extractMemberId(authorizationHeader);
        boolean isScrapped = scrapService.toggleScrap(memberId, req);

        String message = isScrapped ? "스크랩 되었습니다." : "스크랩이 취소되었습니다.";
        return ApiResponse.success(HttpStatus.OK, message, isScrapped);
    }

    // 내 스크랩 조회
    @GetMapping("/myscrap")
    public ApiResponse<SliceResponse<ScrapResponse>> getMyScraps(
            @RequestHeader("Authorization") String authorizationHeader,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        int memberId = extractMemberId(authorizationHeader);
        return ApiResponse.success(scrapService.getMyScraps(memberId, pageable));
    }

    private int extractMemberId(String authorizationHeader) {
        String accessToken = authorizationHeader.split(" ")[1];
        return Integer.parseInt(jwtTokenProvider.parseSubject(accessToken));
    }
}