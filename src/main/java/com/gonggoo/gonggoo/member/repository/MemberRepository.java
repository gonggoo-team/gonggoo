package com.gonggoo.gonggoo.member.repository;

import com.gonggoo.gonggoo.global.domain.Role;
import com.gonggoo.gonggoo.member.domain.Member;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, Integer> {

    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByNickname(String nickname);
    Role findRoleById(int id);
    Optional<Member> findByEmail(String email);

    @Modifying
    @Query("UPDATE Member m SET m.status = 'DELETED', m.deletedAt = CURRENT_TIMESTAMP WHERE m.id = :id")
    int softDeletedById(@Param("id") int id);
}
