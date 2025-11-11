package com.gonggoo.gonggoo.member.service;

import com.gonggoo.gonggoo.member.domain.Member;
import com.gonggoo.gonggoo.member.dto.response.MemberInfoResponse;
import com.gonggoo.gonggoo.member.repository.MemberRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final MemberRepository memberRepository;

    public MemberInfoResponse getAllMembers() {
        List<Member> members = memberRepository.findAll();
        return MemberInfoResponse.from(members);
    }
}
