package com.gonggoo.gonggoo.coopost.repository;

import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import com.gonggoo.gonggoo.coopost.domain.Coopost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.UUID;


// 동적 쿼리에 필요한 JpaSpecificationExecutor 추가 가능
public interface CoopostRepository extends JpaRepository<Coopost, UUID>, JpaSpecificationExecutor<Coopost> {

        Page<Coopost> findByAuthorId(UUID authorId, Pageable pageable);

        Page<Coopost> findByStatus(CoopostStatus status, Pageable pageable);

        Page<Coopost> findAllByOrderByViewCountDesc(Pageable pageable);

        // 커서가 없을 때 (첫 페이지 로딩)
        Page<Coopost> findByOrderByCreatedAtDesc(Pageable pageable);

        // 커서가 있을 때 (다음 페이지 로딩)
        Page<Coopost> findByCreatedAtBeforeOrderByCreatedAtDesc(LocalDateTime createdAt, Pageable pageable);

        // 첫 페이지 로딩용 (기존 메서드 활용 가능)
        Page<Coopost> findAllByOrderByViewCountDescCoopostIdDesc(Pageable pageable);

        // 다음 페이지 로딩용
        Page<Coopost> findByViewCountLessThanOrViewCountEqualsAndCoopostIdLessThanOrderByViewCountDescCoopostIdDesc(long viewCount, UUID coopostId, Pageable pageable);
}