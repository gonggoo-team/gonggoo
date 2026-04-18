package com.gonggoo.gonggoo.coopost.repository;

import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.dto.request.CoopostSearchCondition;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

import java.time.LocalDateTime;
import java.util.UUID;

public interface CoopostRepositoryCustom {
    //게시글 검색
    Slice<Coopost> search(String keyword, CoopostCategory category, String location,
                          LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable);

    //내가 쓴 글 조회
    Slice<Coopost> findMyPosts(int authorId,
                               LocalDateTime createdAtCursor, UUID idCursor, Pageable pageable);

    //인기 게시글 조회 (조회수, ID 기준)
    Slice<Coopost> findPopular(Long viewCountCursor, UUID idCursor, Pageable pageable);

    Coopost getByIdWithLock(UUID coopostId);

    //통합 검색 메서드(필터, 정렬, 커서 포함)
    Slice<Coopost> searchByCondition(CoopostSearchCondition condition, Object cursorValue, UUID cursorId, Pageable pageable);

    //실시간 필터링 결과 개수 조회(with no paging)
    Long countByCondition(CoopostSearchCondition condition);

}
