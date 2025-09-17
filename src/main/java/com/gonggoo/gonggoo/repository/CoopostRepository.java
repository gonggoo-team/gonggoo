package com.gonggoo.gonggoo.repository;

import com.gonggoo.gonggoo.domain.Coopost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;


// 동적 쿼리에 필요한 JpaSpecificationExecutor 추가 가능
public interface CoopostRepository extends JpaRepository<Coopost, UUID>, JpaSpecificationExecutor<Coopost> {

        Page<Coopost> findByAuthorId(UUID authorId, Pageable pageable);

        Page<Coopost> findByStatus(com.gonggoo.gonggoo.domain.CoopostStatus status, Pageable pageable);

        Page<Coopost> findAllByOrderByViewCountDesc(Pageable pageable);

}