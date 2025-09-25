package com.gonggoo.gonggoo.coopost.service;

import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostCreateRequest;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostUpdateRequest;
import com.gonggoo.gonggoo.coopost.dto.response.CoopostResponse;
import com.gonggoo.gonggoo.coopost.dto.response.PageResponse;
import com.gonggoo.gonggoo.coopost.repository.CoopostRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional; // Optional import 추가
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CoopostServiceImpl implements CoopostService {

    private final CoopostRepository repo;

    @Override
    public CoopostResponse create(CoopostCreateRequest req) {
        // 기본값
        Coopost entity = Coopost.builder()
                .authorId(Objects.requireNonNull(req.getAuthorId(), "authorId required"))
                .title(req.getTitle())
                .content(req.getContent())
                .status(CoopostStatus.OPEN)
                .pricePerUnit(req.getPricePerUnit())
                .minParticipants(req.getMinParticipants())
                .maxParticipants(req.getMaxParticipants())
                .currentParticipants(0)
                // ▼▼▼ 수정된 부분 1: 카테고리가 null이면 ELSE를 기본값으로 설정 ▼▼▼
                .category(Optional.ofNullable(req.getCategory()).orElse(CoopostCategory.ELSE))
                .location(req.getLocation())
                .deadlineAt(req.getDeadlineAt())
                .viewCount(0)
                .build();
        return CoopostResponse.from(repo.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CoopostResponse> getAll(LocalDateTime cursor, Pageable pageable) {
        Page<Coopost> page;
        if (cursor == null) {
            // 커서가 없으면 첫 페이지를 조회합니다.
            page = repo.findByOrderByCreatedAtDesc(pageable);
        } else {
            // 커서가 있으면 해당 시간 이전의 페이지를 조회합니다.
            page = repo.findByCreatedAtBeforeOrderByCreatedAtDesc(cursor, pageable);
        }
        return PageResponse.of(page, CoopostResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CoopostResponse> getMyPosts(UUID authorId, LocalDateTime cursor, Pageable pageable) {
        Specification<Coopost> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. authorId 조건: 작성자 ID가 일치해야 함
            predicates.add(criteriaBuilder.equal(root.get("authorId"), authorId));

            // 2. status 조건: 삭제된 게시글은 제외
            predicates.add(criteriaBuilder.notEqual(root.get("status"), CoopostStatus.DELETED));

            // 3. cursor 조건: cursor(createdAt)보다 이전 게시글을 조회
            if (cursor != null) {
                predicates.add(criteriaBuilder.lessThan(root.get("createdAt"), cursor));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Coopost> page = repo.findAll(spec, pageable);

        return PageResponse.of(page, CoopostResponse::from);
    }
    @Override
    public CoopostResponse getById(UUID coopostId, boolean increaseView) {
        Coopost e = repo.findById(coopostId)
                .orElseThrow(() -> new EntityNotFoundException("Coopost not found"));
        if (increaseView) {
            e.setViewCount(e.getViewCount() + 1);
        }
        return CoopostResponse.from(e);
    }

    @Override
    public CoopostResponse update(UUID coopostId, CoopostUpdateRequest req) {
        Coopost e = repo.findById(coopostId)
                .orElseThrow(() -> new EntityNotFoundException("Coopost not found"));

        if (req.getTitle() != null) e.setTitle(req.getTitle());
        if (req.getContent() != null) e.setContent(req.getContent());
        if (req.getPricePerUnit() != null) e.setPricePerUnit(req.getPricePerUnit());
        if (req.getMinParticipants() != null) e.setMinParticipants(req.getMinParticipants());
        if (req.getMaxParticipants() != null) e.setMaxParticipants(req.getMaxParticipants());
        if (req.getCategory() != null) e.setCategory(req.getCategory());
        if (req.getLocation() != null) e.setLocation(req.getLocation());
        if (req.getDeadlineAt() != null) e.setDeadlineAt(req.getDeadlineAt());

        return CoopostResponse.from(e);
    }

    //Soft Delete으로 공구글 삭제 처리
    @Override
    public void delete(UUID coopostId) {
        Coopost coopost = repo.findById(coopostId)
                .orElseThrow(() -> new EntityNotFoundException("Coopost not found"));
        coopost.setStatus(CoopostStatus.DELETED);
        repo.save(coopost);
    }

    @Override
    public CoopostResponse changeStatus(UUID coopostId, CoopostStatus status) {
        Coopost e = repo.findById(coopostId)
                .orElseThrow(() -> new EntityNotFoundException("Coopost not found"));
        e.setStatus(status);
        return CoopostResponse.from(e);
    }



    @Override
    @Transactional(readOnly = true)
    public PageResponse<CoopostResponse> getPopular(Long viewCountCursor, UUID idCursor, Pageable pageable) {
        Page<Coopost> page;
        if (viewCountCursor == null || idCursor == null) {
            // 커서가 없으면 첫 페이지 조회
            page = repo.findAllByOrderByViewCountDescCoopostIdDesc(pageable);
        } else {
            // 커서가 있으면 다음 페이지 조회
            page = repo.findByViewCountLessThanOrViewCountEqualsAndCoopostIdLessThanOrderByViewCountDescCoopostIdDesc(viewCountCursor, idCursor, pageable);
        }
        return PageResponse.of(page, CoopostResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CoopostResponse> search(String keyword, CoopostCategory category, String location, LocalDateTime cursor, Pageable pageable) {
        // Specification: 동적 쿼리 생성을 위한 JPA 표준 기술
        Specification<Coopost> spec = (root, query, criteriaBuilder) -> {
            // Predicate는 WHERE절의 각 조건을 의미합니다.
            List<Predicate> predicates = new ArrayList<>();

            // 1. keyword 조건: 제목 또는 내용에 키워드가 포함되는 경우
            if (keyword != null && !keyword.trim().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(root.get("title"), "%" + keyword + "%"),
                        criteriaBuilder.like(root.get("content"), "%" + keyword + "%")
                ));
            }

            // 2. category 조건: 카테고리가 일치하는 경우
            // ▼▼▼ 수정된 부분 2: Enum 타입에 맞게 null 체크만 하도록 변경 ▼▼▼
            if (category != null) {
                predicates.add(criteriaBuilder.equal(root.get("category"), category));
            }

            // 3. location 조건: 지역이 일치하는 경우
            if (location != null && !location.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("location"), location));
            }

            // 4. status 조건: 삭제된(DELETED) 게시글은 제외
            predicates.add(criteriaBuilder.notEqual(root.get("status"), CoopostStatus.DELETED));

            // 5. cursor 조건: cursor(createdAt)보다 이전 게시글을 조회
            if (cursor != null) {
                // BaseEntity를 상속받았으므로 "createdAt" 필드를 사용할 수 있습니다.
                predicates.add(criteriaBuilder.lessThan(root.get("createdAt"), cursor));
            }

            // 모든 조건을 AND로 결합하여 최종 WHERE절 생성
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        // 생성된 동적 쿼리와 Pageable 객체로 데이터 조회
        Page<Coopost> page = repo.findAll(spec, pageable);

        // 조회된 Page<Coopost>를 PageResponse<CoopostResponse> 형태로 변환하여 반환
        return PageResponse.of(page, CoopostResponse::from);
    }
}