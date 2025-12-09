package com.gonggoo.gonggoo.scrap.repository;

import com.gonggoo.gonggoo.scrap.domain.Scrap;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ScrapRepository extends JpaRepository<Scrap, UUID> {

    // ⭐ [추가] 토글 기능을 위해 (Member + Coopost) 조합으로 스크랩 내역 조회
    Optional<Scrap> findByMemberIdAndCoopostCoopostId(int memberId, UUID coopostId);

    //내 스크랩 조회 : 삭제된 공구글은 조회되지 않음.
    @Query("SELECT s FROM Scrap s " +
            "JOIN FETCH s.coopost c " +
            "WHERE s.member.id = :memberId " +
            "AND c.deletedAt IS NULL " + // 👈 이 줄이 핵심입니다!
            "ORDER BY s.createdAt DESC")
    Slice<Scrap> findMyScraps(@Param("memberId") int memberId, Pageable pageable);
}