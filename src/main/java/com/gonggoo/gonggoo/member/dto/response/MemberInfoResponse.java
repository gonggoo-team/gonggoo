package com.gonggoo.gonggoo.member.dto.response;

import com.gonggoo.gonggoo.member.domain.Member;
import java.util.List;

public record MemberInfoResponse(
        List<MemberResponse> members
) {
    public static MemberInfoResponse from(List<Member> members) {
        List<MemberResponse> memberInfo = members.stream()
                .map(MemberResponse::from)
                .toList();
        return new MemberInfoResponse(memberInfo);
    }
}
