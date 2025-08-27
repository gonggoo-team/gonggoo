package com.gonggoo.gonggoo.repository;

import com.gonggoo.gonggoo.domain.Coopost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CoopostRepository extends JpaRepository<Coopost, UUID>{

        Page<Coopost> findByAuthorId(UUID authorId, Pageable pageable);

    Page<Coopost> findByStatus(com.example.app.domain.CoopostStatus status, Pageable pageable);
    Page<Coopost> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            String titleKeyword,
            String contentKeyword,
            Pageable pageable
    );

    Page<Coopost> findAll(Pageable pageable);
    Page<Coopost> findByCategory(String category, Pageable pageable);
    Page<Coopost> findAllByOrderByViewCountDesc(Pageable pageable);

}