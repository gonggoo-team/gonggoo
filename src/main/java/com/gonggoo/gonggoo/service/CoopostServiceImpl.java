package com.gonggoo.gonggoo.service;

import com.gonggoo.gonggoo.domain.Coopost;
import com.gonggoo.gonggoo.dto.request.CoopostCreateRequest;
import com.gonggoo.gonggoo.dto.request.CoopostUpdateRequest;
import com.gonggoo.gonggoo.dto.response.CoopostResponse;
import com.gonggoo.gonggoo.dto.response.PageResponse;
import com.gonggoo.gonggoo.repository.CoopostRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .status(com.example.app.domain.CoopostStatus.OPEN)
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

    @Override
    public void delete(UUID coopostId) {
        if (!repo.existsById(coopostId)) {
            throw new EntityNotFoundException("Coopost not found");
        }
        repo.deleteById(coopostId);
    }

    @Override
    public CoopostResponse changeStatus(UUID coopostId, com.example.app.domain.CoopostStatus status) {
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
    public PageResponse<CoopostResponse> search(String keyword, Pageable pageable) {
        return PageResponse.of(
                repo.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(keyword, keyword, pageable),
                CoopostResponse::from
        );
    }
}
