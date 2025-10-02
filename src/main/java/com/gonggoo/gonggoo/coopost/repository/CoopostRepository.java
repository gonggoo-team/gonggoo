package com.gonggoo.gonggoo.coopost.repository;

import com.gonggoo.gonggoo.coopost.domain.Coopost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.UUID;

// ▼▼▼ 수정된 부분: JpaSpecificationExecutor를 삭제하고 CoopostRepositoryCustom를 상속받습니다. ▼▼▼
public interface CoopostRepository extends JpaRepository<Coopost, UUID>, CoopostRepositoryCustom {

        // QueryDSL로 구현되지 않은 나머지 간단한 쿼리 메서드들은 그대로 유지합니다.
        // (getAll, getPopular 등에서 사용됩니다)

        Page<Coopost> findByOrderByCreatedAtDesc(Pageable pageable);

        Page<Coopost> findByCreatedAtBeforeOrderByCreatedAtDesc(LocalDateTime createdAt, Pageable pageable);
}