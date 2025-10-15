package com.gonggoo.gonggoo.coopost.repository;

import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import java.time.LocalDateTime;
import java.util.UUID;

public interface CoopostRepositoryCustom {
    /**
     * 게시글 검색 (키워드, 카테고리, 지역)
     */
    Slice<Coopost> search(String keyword, CoopostCategory category, String location,
                          LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable);

    /**
     * 내가 쓴 게시글 조회
     */
    Slice<Coopost> findMyPosts(UUID authorId,
                               LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable);

    /**
     * 인기 게시글 조회 (조회수, ID 기준)
     */
    Slice<Coopost> findPopular(Long viewCountCursor, UUID idCursor, Pageable pageable);
}
