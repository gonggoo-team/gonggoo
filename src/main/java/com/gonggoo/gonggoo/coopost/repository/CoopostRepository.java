package com.gonggoo.gonggoo.coopost.repository;

import com.gonggoo.gonggoo.coopost.domain.Coopost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // 변경점
import org.springframework.data.repository.query.Param; // 변경점

import java.time.LocalDateTime;
import java.util.UUID;

// ▼▼▼ 수정된 부분: JpaSpecificationExecutor를 삭제하고 CoopostRepositoryCustom를 상속받습니다. ▼▼▼
public interface CoopostRepository extends JpaRepository<Coopost, UUID>, CoopostRepositoryCustom {

        // 첫 페이지 조회를 위한 메서드 (커서 없음)
        Slice<Coopost> findByOrderByCreatedAtDescCoopostIdDesc(Pageable pageable);

        // @Query를 사용하여 복합 커서 WHERE 절 구현
        @Query("SELECT c FROM Coopost c " +
                "WHERE (c.createdAt < :createdAtCursor) OR " +
                "(c.createdAt = :createdAtCursor AND c.coopostId < :idCursor) " +
                "ORDER BY c.createdAt DESC, c.coopostId DESC")
        Slice<Coopost> findNextPage(@Param("createdAtCursor") LocalDateTime createdAtCursor,
                                    @Param("idCursor") UUID idCursor,
                                    Pageable pageable);
}