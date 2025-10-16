package com.gonggoo.gonggoo.coopost.service;

import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus; // CoopostStatus 임포트
import com.gonggoo.gonggoo.coopost.dto.request.CoopostCreateRequest;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostUpdateRequest;
import com.gonggoo.gonggoo.coopost.dto.response.CoopostResponse;
import com.gonggoo.gonggoo.coopost.dto.response.SliceResponse;
import com.gonggoo.gonggoo.coopost.repository.CoopostRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach; // BeforeEach 임포트
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@Transactional
class CoopostServiceIntegrationTest {

    @Autowired
    private CoopostService coopostService;

    @Autowired
    private CoopostRepository coopostRepository;

    @Autowired
    private EntityManager em;

    // --- 필터링 테스트를 위한 데이터 사전 설정 ---
    @BeforeEach
    void setUp() {
        coopostRepository.deleteAll(); // 각 테스트 시작 전 데이터 초기화
        Coopost post1 = createDummyCoopost("사과 같이 사실 분", "맛있는 사과입니다", CoopostCategory.FOOD, "서울시 강남구");
        Coopost post2 = createDummyCoopost("강아지 사료 공구", "대용량 사료 저렴하게 나눠요", CoopostCategory.PET_SUPPLIES, "서울시 서초구");
        Coopost post3 = createDummyCoopost("키보드 사실 분", "저렴한 기계식 키보드입니다", CoopostCategory.HOME_APPLIANCES, "부산시 해운대구");
        Coopost post4 = createDummyCoopost("아기 기저귀 공구", "대용량 기저귀", CoopostCategory.BABY_SUPPLIES, "서울시 강남구");
        coopostRepository.save(post1);
        coopostRepository.save(post2);
        coopostRepository.save(post3);
        coopostRepository.save(post4);
    }

    // =============================================
    //          🎉 추가된 필터링 테스트 코드 🎉
    // =============================================
    @Test
    @DisplayName("검색: 키워드(제목)로 필터링 성공")
    void search_byKeyword_Title_Success() {
        // given
        String keyword = "사과";
        Pageable pageable = PageRequest.of(0, 10);

        // when
        SliceResponse<CoopostResponse> response = coopostService.search(keyword, null, null, null, null, pageable);

        // then
        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getContent().get(0).getTitle()).contains(keyword);
    }

    @Test
    @DisplayName("검색: 키워드(내용)로 필터링 성공")
    void search_byKeyword_Content_Success() {
        // given
        String keyword = "대용량";
        Pageable pageable = PageRequest.of(0, 10);

        // when
        SliceResponse<CoopostResponse> response = coopostService.search(keyword, null, null, null, null, pageable);

        // then
        assertThat(response.getContent()).hasSize(2);
        assertThat(response.getContent()).extracting("content").contains("대용량 사료 저렴하게 나눠요", "대용량 기저귀");
    }

    @Test
    @DisplayName("검색: 카테고리로 필터링 성공")
    void search_byCategory_Success() {
        // given
        CoopostCategory category = CoopostCategory.FOOD;
        Pageable pageable = PageRequest.of(0, 10);

        // when
        SliceResponse<CoopostResponse> response = coopostService.search(null, category, null, null, null, pageable);

        // then
        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getContent().get(0).getCategory()).isEqualTo(category);
    }

    @Test
    @DisplayName("검색: 지역으로 필터링 성공")
    void search_byLocation_Success() {
        // given
        String location = "서울시 강남구";
        Pageable pageable = PageRequest.of(0, 10);

        // when
        SliceResponse<CoopostResponse> response = coopostService.search(null, null, location, null, null, pageable);

        // then
        assertThat(response.getContent()).hasSize(2);
        assertThat(response.getContent()).extracting("location").containsOnly(location);
    }

    @Test
    @DisplayName("검색: 복합 조건(카테고리 + 지역) 필터링 성공")
    void search_byMultipleFilters_Success() {
        // given
        CoopostCategory category = CoopostCategory.BABY_SUPPLIES;
        String location = "서울시 강남구";
        Pageable pageable = PageRequest.of(0, 10);

        // when
        SliceResponse<CoopostResponse> response = coopostService.search(null, category, location, null, null, pageable);

        // then
        assertThat(response.getContent()).hasSize(1);
        CoopostResponse result = response.getContent().get(0);
        assertThat(result.getCategory()).isEqualTo(category);
        assertThat(result.getLocation()).isEqualTo(location);
        assertThat(result.getTitle()).isEqualTo("아기 기저귀 공구");
    }

    @Test
    @DisplayName("검색: 결과가 없는 경우 빈 리스트 반환")
    void search_noResults_Success() {
        // given
        String keyword = "존재하지 않는 키워드";
        Pageable pageable = PageRequest.of(0, 10);

        // when
        SliceResponse<CoopostResponse> response = coopostService.search(keyword, null, null, null, null, pageable);

        // then
        assertThat(response.getContent()).isEmpty();
    }

    // =============================================
    //              기존 테스트 코드
    // =============================================

    @Test
    @DisplayName("공구글 생성 성공 테스트")
    void createCoopost_Success() {
        // given
        CoopostCreateRequest req = new CoopostCreateRequest();
        req.setAuthorId(UUID.randomUUID());
        req.setTitle("새로운 테스트 제목");
        req.setContent("새로운 테스트 내용");
        req.setPricePerUnit(BigDecimal.valueOf(10000));
        req.setMinParticipants(2);
        req.setMaxParticipants(10);
        req.setCategory(CoopostCategory.FOOD);
        req.setLocation("서울시 강남구");
        req.setDeadlineAt(LocalDateTime.now().plusDays(7));

        // when
        CoopostResponse response = coopostService.create(req);

        // then
        assertThat(response.getCoopostId()).isNotNull();
        assertThat(response.getTitle()).isEqualTo("새로운 테스트 제목");
        assertThat(response.getCreatedAt()).isNotNull();
        assertThat(response.getModifiedAt()).isNotNull();
    }

    @Test
    @DisplayName("공구글 단건 조회 및 조회수 증가 테스트")
    void getById_Success() {
        // given
        Coopost saved = coopostRepository.findAll().get(0);
        long initialViewCount = saved.getViewCount();

        // when
        CoopostResponse response = coopostService.getById(saved.getCoopostId(), true);

        // then
        assertThat(response.getCoopostId()).isEqualTo(saved.getCoopostId());
        assertThat(response.getViewCount()).isEqualTo(initialViewCount + 1);
    }

    @Test
    @DisplayName("공구글 수정 테스트")
    void updateCoopost_Success() {
        // given
        Coopost saved = coopostRepository.findAll().get(0);
        CoopostUpdateRequest req = new CoopostUpdateRequest();
        req.setTitle("수정된 제목");
        req.setLocation("부산시 해운대구");

        // when
        CoopostResponse response = coopostService.update(saved.getCoopostId(), req);

        // then
        assertThat(response.getTitle()).isEqualTo("수정된 제목");
        assertThat(response.getLocation()).isEqualTo("부산시 해운대구");
    }

    @Test
    @DisplayName("공구글 삭제(soft-delete) 및 조회되지 않음 테스트")
    void deleteCoopost_SoftDelete_Success() {
        // given
        Coopost saved = coopostRepository.findAll().get(0);
        UUID coopostId = saved.getCoopostId();

        // when
        coopostService.delete(coopostId);

        em.flush();
        em.clear();

        // then
        Coopost deletedCoopost = coopostRepository.findById(coopostId).orElseThrow();
        assertThat(deletedCoopost.getDeletedAt()).isNotNull();

        Pageable pageable = PageRequest.of(0, 10);
        SliceResponse<CoopostResponse> response = coopostService.getAll(null, null, pageable);
        assertThat(response.getContent()).hasSize(3); // 기존 4개에서 1개 삭제되어 3개
        assertThat(response.getContent()).extracting("coopostId").doesNotContain(coopostId);
    }


    // 테스트용 더미 데이터 생성 헬퍼 메소드
    private Coopost createDummyCoopost(String title, String content, CoopostCategory category, String location) {
        return Coopost.builder()
                .authorId(UUID.randomUUID())
                .title(title)
                .content(content)
                .status(CoopostStatus.OPEN)
                .pricePerUnit(BigDecimal.ONE)
                .minParticipants(1)
                .maxParticipants(5)
                .currentParticipants(1)
                .category(category)
                .location(location)
                .deadlineAt(LocalDateTime.now().plusDays(1))
                .viewCount(0)
                .build();
    }
}