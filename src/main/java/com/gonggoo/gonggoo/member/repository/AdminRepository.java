package com.gonggoo.gonggoo.member.repository;

import com.gonggoo.gonggoo.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Member, Integer> {

}
