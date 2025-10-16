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


public interface CoopostRepository extends JpaRepository<Coopost, UUID>, CoopostRepositoryCustom {

        // 1. deletedAt IS NULL 조건을 메소드 이름에 추가
        Slice<Coopost> findByDeletedAtIsNullOrderByCreatedAtDescCoopostIdDesc(Pageable pageable);

        // 2. @Query 어노테이션 안의 WHERE 절에 c.deletedAt IS NULL 조건 추가
        @Query("SELECT c FROM Coopost c " +
                "WHERE ((c.createdAt < :createdAtCursor) OR " +
                "(c.createdAt = :createdAtCursor AND c.coopostId < :idCursor)) " +
                "AND c.deletedAt IS NULL " + // 조건 추가
                "ORDER BY c.createdAt DESC, c.coopostId DESC")
        Slice<Coopost> findNextPage(@Param("createdAtCursor") LocalDateTime createdAtCursor,
                                    @Param("idCursor") UUID idCursor,
                                    Pageable pageable);
}