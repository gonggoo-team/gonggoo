package com.gonggoo.gonggoo.coopost.service;

import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostCreateRequest;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostUpdateRequest;
import com.gonggoo.gonggoo.coopost.dto.response.CoopostResponse;
import com.gonggoo.gonggoo.coopost.dto.response.PageResponse;
import com.gonggoo.gonggoo.coopost.dto.response.SliceResponse;
import com.gonggoo.gonggoo.coopost.repository.CoopostRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
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

    // 공구글 생성
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

    // 공구글 상세 조회 (조회수 +1) ID는 CoopostID를 말함
    @Override
    @Transactional(readOnly = true)
    public CoopostResponse getById(UUID coopostId, boolean increaseView) {
        Coopost e = repo.findById(coopostId)
                .orElseThrow(() -> new EntityNotFoundException("Coopost not found"));
        if (increaseView) {
            e.setViewCount(e.getViewCount() + 1);
        }
        return CoopostResponse.from(e);
    }

    //공구글 업데이트
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

    // 공구글 삭제 (Soft Delete)
    @Override
    public void delete(UUID coopostId) {
        Coopost coopost = repo.findById(coopostId)
                .orElseThrow(() -> new EntityNotFoundException("Coopost not found"));
        coopost.setStatus(CoopostStatus.DELETED);
        repo.save(coopost);
    }

    //공구글 상태 변경
    @Override
    public CoopostResponse changeStatus(UUID coopostId, CoopostStatus status) {
        Coopost e = repo.findById(coopostId)
                .orElseThrow(() -> new EntityNotFoundException("Coopost not found"));
        e.setStatus(status);
        return CoopostResponse.from(e);
    }

    // --- Slice 기반 커서 페이지네이션 API ---

    //전체 공구글 조회
    @Override
    @Transactional(readOnly = true)
    public SliceResponse<CoopostResponse> getAll(LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable) {
        Slice<Coopost> slice;
        if (createdAtCursor == null || idCursor == null) {
            slice = repo.findByOrderByCreatedAtDescCoopostIdDesc(pageable);
        } else {
            slice = repo.findNextPage(createdAtCursor, idCursor, pageable);
        }
        return SliceResponse.of(slice, CoopostResponse::from);
    }

    // 내가 쓴 공구글 조회
    @Override
    @Transactional(readOnly = true)
    public SliceResponse<CoopostResponse> getMyPosts(UUID authorId, LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable) {
        Slice<Coopost> slice = repo.findMyPosts(authorId, createdAtCursor, idCursor, pageable);
        return SliceResponse.of(slice, CoopostResponse::from);
    }

    // 인기 공구글 조회
    @Override
    @Transactional(readOnly = true)
    public SliceResponse<CoopostResponse> getPopular(Long viewCountCursor, UUID idCursor, Pageable pageable) {
        Slice<Coopost> slice = repo.findPopular(viewCountCursor, idCursor, pageable);
        return SliceResponse.of(slice, CoopostResponse::from);
    }

    // 공구글 검색
    @Override
    @Transactional(readOnly = true)
    public SliceResponse<CoopostResponse> search(String keyword, CoopostCategory category, String location,
                                                 LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable) {
        Slice<Coopost> slice = repo.search(keyword, category, location, createdAtCursor, idCursor, pageable);
        return SliceResponse.of(slice, CoopostResponse::from);
    }
}