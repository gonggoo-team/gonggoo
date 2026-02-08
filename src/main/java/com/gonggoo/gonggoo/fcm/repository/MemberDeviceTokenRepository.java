package com.gonggoo.gonggoo.fcm.repository;

import com.gonggoo.gonggoo.fcm.domain.UserDevice;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberDeviceTokenRepository extends JpaRepository<UserDevice, Long> {

    Optional<UserDevice> findByFcmToken(String fcmToken);
    List<UserDevice> findByMemberId(int memberId);

    @Query("""
            select ud.fcmToken
            from UserDevice ud
            where ud.member.id in :memberIds
            """)
    List<String> findAllTokensByMemberIds(@Param("memberIds") List<Integer> memberIds);
    void deleteByFcmToken(String fcmToken);
}
