package com.gonggoo.gonggoo.service;

import com.gonggoo.gonggoo.domain.Coopost;
import com.gonggoo.gonggoo.dto.request.CoopostCreateRequest;
import com.gonggoo.gonggoo.dto.request.CoopostUpdateRequest;
import com.gonggoo.gonggoo.dto.response.CoopostResponse;
import com.gonggoo.gonggoo.dto.response.PageResponse;
import com.gonggoo.gonggoo.repository.CoopostRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
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
                .status(com.gonggoo.gonggoo.domain.CoopostStatus.OPEN)
                .pricePerUnit(req.getPricePerUnit())
                .minParticipants(req.getMinParticipants())
                .maxParticipants(req.getMaxParticipants())
                .currentParticipants(0)
                .category(req.getCategory())
                .location(req.getLocation())
                .deadlineAt(req.getDeadlineAt())
                .viewCount(0)
                .build();
        return CoopostResponse.from(repo.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CoopostResponse> getAll(Pageable pageable) {
        Page<Coopost> page = repo.findAll(pageable);
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
        coopost.setStatus(com.gonggoo.gonggoo.domain.CoopostStatus.DELETED);
        repo.save(coopost);
    }

    @Override
    public CoopostResponse changeStatus(UUID coopostId, com.gonggoo.gonggoo.domain.CoopostStatus status) {
        Coopost e = repo.findById(coopostId)
                .orElseThrow(() -> new EntityNotFoundException("Coopost not found"));
        e.setStatus(status);
        return CoopostResponse.from(e);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CoopostResponse> getMyPosts(UUID authorId, Pageable pageable) {
        return PageResponse.of(
                repo.findByAuthorId(authorId, pageable),
                CoopostResponse::from
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CoopostResponse> getPopular(Pageable pageable) {
        return PageResponse.of(
                repo.findAllByOrderByViewCountDesc(pageable),
                CoopostResponse::from
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CoopostResponse> search(String keyword,String category, String location, Pageable pageable) {
        // Specification : 동적 쿼리 생성을 위한 인터페이스 , JPA 표준 기술
        Specification<Coopost> spec = (root, query, criteriaBuilder) -> {
            //Predicate 는 WHERE절 조건 하나하나를 의미
            List<Predicate> predicates = new ArrayList<>();

            // 1. keyword 조건: keyword가 null이 아니고 비어있지 않을 때 검색
            // Fix: Use !keyword.trim().isEmpty()
            if (keyword != null && !keyword.trim().isEmpty()) {
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(root.get("title"), "%" + keyword + "%"),
                        criteriaBuilder.like(root.get("content"), "%" + keyword + "%")
                ));
            }

            // 2. category 조건: category가 null이 아니고 비어있지 않을 때 검색
            // Fix: Use !category.trim().isEmpty()
            if (category != null && !category.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("category"), category));
            }

            // 3. location 조건: location가 null이 아니고 비어있지 않을 때 검색
            // Fix: Use !location.trim().isEmpty()
            if (location != null && !location.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("location"), location));
            }

            // 4. status 조건: 삭제된 글은 제외
            predicates.add(criteriaBuilder.notEqual(root.get("status"), com.gonggoo.gonggoo.domain.CoopostStatus.DELETED));

            // 모든 조건들을 AND로 결합
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        // repo.findAll(spec, pagable)로 동적 생성 쿼리를 실행
        Page<Coopost> page = repo.findAll(spec, pageable);

        return PageResponse.of(page, CoopostResponse::from);
        }
    }

