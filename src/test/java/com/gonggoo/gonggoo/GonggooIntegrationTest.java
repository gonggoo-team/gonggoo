//package com.gonggoo.gonggoo; // (패키지 경로는 맞게 수정하세요)
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.gonggoo.gonggoo.auth.dto.LoginRequest;
//import com.gonggoo.gonggoo.auth.service.RedisTokenBlackListService;
//import com.gonggoo.gonggoo.common.domain.GeoLocation;
//import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
//import com.gonggoo.gonggoo.coopost.dto.request.CoopostCreateRequest;
//import com.gonggoo.gonggoo.member.dto.request.MemberSignupRequest;
//import com.jayway.jsonpath.JsonPath;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.MvcResult;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.UUID;
//
//// MockMvcRequestBuilders와 MockMvcResultMatchers를 static import 합니다.
//import static org.mockito.ArgumentMatchers.anyString;
//import static org.mockito.BDDMockito.given;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//@ActiveProfiles("local")
//@Transactional // 🚨 매우 중요: 각 테스트 완료 후 DB를 롤백하여 테스트 간 독립성 보장
//class GonggooIntegrationTest {
//
//    @Autowired
//    private MockMvc mvc; // HTTP 요청을 시뮬레이션
//
//    @Autowired
//    private ObjectMapper objectMapper; // Java 객체를 JSON으로 변환
//
//    @MockBean
//    private RedisTokenBlackListService redisTokenBlackListService; // Redis 의존성 모킹 (Redis 서버 없이 테스트 가능)
//
//    @Test
//    @DisplayName("통합 시나리오: 회원가입 -> 로그인 -> 공구글 작성 -> 내 공구글 조회")
//    void full_integration_scenario() throws Exception {
//
//        // Redis 필터 통과를 위한 Mock 설정
//        given(redisTokenBlackListService.isContainToken(anyString())).willReturn(false);
//
//        // --- 1. 회원가입 ---
//        // MemberSignupRequest DTO 준비
//        GeoLocation location = new GeoLocation(37.5665, 126.9780);
//        MemberSignupRequest signupRequest = new MemberSignupRequest(
//                "testUser123",
//                "010-1234-5678",
//                "test-integ@example.com", // 중복되지 않는 이메일
//                "password123!",
//                location
//        );
//
//        // 회원가입 API 호출
//        mvc.perform(post("/api/member/v1/signup")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(signupRequest)))
//                .andExpect(status().isOk()); // ✅ [수정됨] 201 Created -> 200 OK 허용
//
//        // --- 2. 로그인 및 토큰 획득 ---
//        LoginRequest loginRequest = new LoginRequest("test-integ@example.com", "password123!");
//
//        // 로그인 API 호출
//        MvcResult loginResult = mvc.perform(post("/api/auth/v1/login")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(loginRequest)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data.accessToken").exists())
//                .andReturn();
//
//        // 응답에서 accessToken 추출
//        String loginResponse = loginResult.getResponse().getContentAsString();
//        String accessToken = JsonPath.parse(loginResponse).read("$.data.accessToken");
//
//        // --- 3. 공구글 생성 (핵심 통합 테스트) ---
//        CoopostCreateRequest createRequest = new CoopostCreateRequest();
//        createRequest.setTitle("통합 테스트 공구글");
//        createRequest.setContent("내용입니다.");
//        createRequest.setPricePerUnit(new BigDecimal("10000"));
//        createRequest.setMinParticipants(2);
//        createRequest.setMaxParticipants(10);
//        createRequest.setCategory(CoopostCategory.FOOD);
//        createRequest.setLocation("서울시 강남구");
//        createRequest.setDeadlineAt(LocalDateTime.now().plusDays(3));
//        // [중요] DTO에 authorId를 넣지 않습니다.
//
//        // 공구글 생성 API 호출 (JWT 헤더 포함)
//        MvcResult createResult = mvc.perform(post("/api/coopost/v1")
//                        .header("Authorization", "Bearer " + accessToken) // <-- 3단계에서 수정한 인증 로직
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(createRequest)))
//                .andExpect(status().isCreated()) // 공구글 생성은 201 Created 유지
//                .andExpect(jsonPath("$.data.title").value("통합 테스트 공구글"))
//                .andExpect(jsonPath("$.data.authorId").isNumber()) // <-- int ID로 잘 들어갔는지 확인
//                .andReturn();
//
//        // 생성된 coopostId와 authorId 추출
//        String createResponse = createResult.getResponse().getContentAsString();
//        String coopostId = JsonPath.parse(createResponse).read("$.data.coopostId");
//        int authorId = JsonPath.parse(createResponse).read("$.data.authorId");
//
//        // --- 4. 내 공구글 조회 ---
//        // 내 공구글 조회 API 호출 (JWT 헤더 포함)
//        mvc.perform(get("/api/coopost/v1/myposts")
//                        .header("Authorization", "Bearer " + accessToken)) // <-- 3단계에서 수정한 인증 로직
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data.content[0].coopostId").value(coopostId))
//                .andExpect(jsonPath("$.data.content[0].authorId").value(authorId));
//
//        System.out.println("✅ 통합 시나리오 테스트 성공!");
//    }
//
//    @Test
//    @DisplayName("예외 처리 테스트: 존재하지 않는 공구글 조회 (404)")
//    void coopost_not_found_exception_test() throws Exception {
//
//        // Redis 필터 통과를 위한 Mock 설정
//        given(redisTokenBlackListService.isContainToken(anyString())).willReturn(false);
//
//        String nonExistentUuid = UUID.randomUUID().toString();
//
//        // 존재하지 않는 UUID로 상세 조회 API 호출
//        mvc.perform(get("/api/coopost/v1/" + nonExistentUuid))
//                .andExpect(status().isNotFound()) // 404 응답 확인
//                // 4단계에서 수정한 ErrorCode 응답 본문 확인
//                .andExpect(jsonPath("$.message").value("해당 공구글이 존재하지 않습니다."))
//                .andExpect(jsonPath("$.errorDetails.code").value("COOPOST_NOT_FOUND")); // 오타 수정된 코드 확인
//
//        System.out.println("✅ 예외 처리 테스트 성공!");
//    }
//}