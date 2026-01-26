package com.gonggoo.gonggoo.coopost.repository;

import com.gonggoo.gonggoo.coopost.domain.Coopost;
import com.gonggoo.gonggoo.coopost.domain.CoopostMember;
import com.gonggoo.gonggoo.member.domain.Member;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface CoopostMemberRepository extends JpaRepository<CoopostMember, UUID> {


    // 중복 신청 확인
    boolean existsByCoopostCoopostIdAndMemberId(UUID coopostId, int memberId);
    // ⭐ [추가] 재신청 로직을 위해 (공구글 + 멤버)로 내역 조회
    Optional<CoopostMember> findByCoopostAndMember(Coopost coopost, Member member);
    Optional<CoopostMember> findByCoopostCoopostIdAndMemberId(UUID coopostId, int memberId);
    // 내가 신청한 목록 조회 (Fetch Join으로 성능 최적화)
    @Query("SELECT cm FROM CoopostMember cm " +
            "JOIN FETCH cm.coopost c " +
            "WHERE cm.member.id = :memberId " +
            "ORDER BY cm.createdAt DESC")
    Slice<CoopostMember> findMyApplyList(@Param("memberId") int memberId, Pageable pageable);

    // 신청 취소를 위한 조회
    Optional<CoopostMember> findByIdAndMemberId(UUID applyId, int memberId);
}