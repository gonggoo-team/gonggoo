package com.gonggoo.gonggoo.coopost.repository;

import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.UUID;

public interface CoopostRepositoryCustom {
    Page<Coopost> search(String keyword, CoopostCategory category, String location, LocalDateTime cursor, Pageable pageable);
    Page<Coopost> findMyPosts(UUID authorId, LocalDateTime cursor, Pageable pageable);
    Page<Coopost> findPopular(Long viewCountCursor, UUID idCursor, Pageable pageable);
}