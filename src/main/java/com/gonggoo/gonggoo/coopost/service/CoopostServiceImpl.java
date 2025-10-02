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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CoopostServiceImpl implements CoopostService {

    private final CoopostRepository repo;

    // ... (create, getAll, getMyPosts 등 다른 메서드는 그대로) ...
    @Override
    public CoopostResponse create(CoopostCreateRequest req) {
        Coopost entity = Coopost.builder()
                .authorId(Objects.requireNonNull(req.getAuthorId(), "authorId required"))
                .title(req.getTitle())
                .content(req.getContent())
                .status(CoopostStatus.OPEN)
                .pricePerUnit(req.getPricePerUnit())
                .minParticipants(req.getMinParticipants())
                .maxParticipants(req.getMaxParticipants())
                .currentParticipants(0)
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
            page = repo.findByOrderByCreatedAtDesc(pageable);
        } else {
            page = repo.findByCreatedAtBeforeOrderByCreatedAtDesc(cursor, pageable);
        }
        return PageResponse.of(page, CoopostResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CoopostResponse> getMyPosts(UUID authorId, LocalDateTime cursor, Pageable pageable) {
        Page<Coopost> page = repo.findMyPosts(authorId, cursor, pageable);
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

    // ▼▼▼ 이 메서드를 수정해야 합니다 ▼▼▼
    @Override
    @Transactional(readOnly = true)
    public PageResponse<CoopostResponse> getPopular(Long viewCountCursor, UUID idCursor, Pageable pageable) {
        // 기존 if/else 로직을 삭제하고 새로운 repo.findPopular() 메서드를 호출합니다.
        Page<Coopost> page = repo.findPopular(viewCountCursor, idCursor, pageable);
        return PageResponse.of(page, CoopostResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CoopostResponse> search(String keyword, CoopostCategory category, String location, LocalDateTime cursor, Pageable pageable) {
        Page<Coopost> page = repo.search(keyword, category, location, cursor, pageable);
        return PageResponse.of(page, CoopostResponse::from);
    }
}