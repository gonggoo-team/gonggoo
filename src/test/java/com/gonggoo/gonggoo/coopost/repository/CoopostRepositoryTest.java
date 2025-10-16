package com.gonggoo.gonggoo.coopost.repository;

import com.gonggoo.gonggoo.coopost.domain.Coopost;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional // 각 테스트 메서드 종료 후 트랜잭션을 롤백하여 테스트 독립성 보장
class CoopostRepositoryTest {

    @Autowired
    private CoopostRepository coopostRepository;

    @Autowired
    private EntityManager entityManager;

    private List<Coopost> savedPosts = new ArrayList<>();

    @BeforeEach
    void setUp() {
        // 테스트 실행 전 항상 깨끗한 상태에서 시작하도록 DB 초기화
        coopostRepository.deleteAllInBatch();
        entityManager.createNativeQuery("ALTER TABLE coopost ALTER COLUMN coopost_id RESTART WITH 1").executeUpdate();


        // 테스트 데이터 25개 생성 (시간 역순으로 저장)
        for (int i = 25; i > 0; i--) {
            Coopost post = Coopost.builder()
                    .title("테스트 " + i)
                    .authorId(UUID.randomUUID()) // 예시 데이터
                    .createdAt(LocalDateTime.of(2025, 10, 15, 12, 0, i))
                    .build();
            savedPosts.add(post);
        }
        coopostRepository.saveAll(savedPosts);

        // ID 순서가 아닌 createdAt 순서로 정렬하여 테스트 검증에 사용
        savedPosts = savedPosts.stream()
                .sorted(Comparator.comparing(Coopost::getCreatedAt).reversed()
                        .thenComparing(Coopost::getCoopostId).reversed())
                .collect(Collectors.toList());
    }

    @Test
    @DisplayName("첫 페이지 조회: 가장 최신 게시글 10개를 정확히 반환한다")
    void findFirstPage_Success() {
        // Given (준비)
        Pageable pageable = PageRequest.of(0, 10, Sort.by(
                Sort.Order.desc("createdAt"),
                Sort.Order.desc("coopostId")
        ));

        // When (실행)
        Slice<Coopost> resultSlice = coopostRepository.findByOrderByCreatedAtDescCoopostIdDesc(pageable);

        // Then (검증)
        assertThat(resultSlice.hasContent()).isTrue();
        assertThat(resultSlice.getContent()).hasSize(10);
        assertThat(resultSlice.hasNext()).isTrue();
        assertThat(resultSlice.isFirst()).isTrue();
        // 첫 번째 결과가 데이터 준비 시 가장 최신 글(25번째)인지 확인
        assertThat(resultSlice.getContent().get(0).getCoopostId()).isEqualTo(savedPosts.get(0).getCoopostId());
        assertThat(resultSlice.getContent().get(9).getCoopostId()).isEqualTo(savedPosts.get(9).getCoopostId());
    }

    @Test
    @DisplayName("다음 페이지 조회: 복합 커서를 사용하여 다음 페이지를 정확히 조회한다")
    void findNextPage_WithCompositeCursor_Success() {
        // Given (준비)
        // 첫 페이지의 마지막 게시글에서 커서 값을 가져옴 (10번째 게시글)
        Coopost cursorPost = savedPosts.get(9);
        LocalDateTime createdAtCursor = cursorPost.getCreatedAt();
        UUID idCursor = cursorPost.getCoopostId();

        // 두 번째 페이지 요청
        Pageable pageable = PageRequest.of(0, 10);

        // When (실행)
        Slice<Coopost> secondPage = coopostRepository.findNextPage(createdAtCursor, idCursor, pageable);

        // Then (검증)
        assertThat(secondPage.hasContent()).isTrue();
        assertThat(secondPage.getContent()).hasSize(10);
        assertThat(secondPage.hasNext()).isTrue();
        // 두 번째 페이지의 첫 번째 글이, 준비된 데이터의 11번째 글인지 확인
        assertThat(secondPage.getContent().get(0).getCoopostId()).isEqualTo(savedPosts.get(10).getCoopostId());
    }

    @Test
    @DisplayName("마지막 페이지 조회: hasNext가 false로 반환된다")
    void findLastPage_hasNextIsFalse() {
        // Given (준비)
        // 20번째 게시글을 커서로 사용하여 마지막 5개 게시글 조회
        Coopost cursorPost = savedPosts.get(19);
        LocalDateTime createdAtCursor = cursorPost.getCreatedAt();
        UUID idCursor = cursorPost.getCoopostId();

        Pageable pageable = PageRequest.of(0, 10);

        // When (실행)
        Slice<Coopost> lastPage = coopostRepository.findNextPage(createdAtCursor, idCursor, pageable);

        // Then (검증)
        assertThat(lastPage.hasContent()).isTrue();
        assertThat(lastPage.getContent()).hasSize(5); // 남은 데이터는 5개
        assertThat(lastPage.hasNext()).isFalse(); // 다음 페이지가 없으므로 false
    }
}