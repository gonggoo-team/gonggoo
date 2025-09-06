package com.gonggoo.gonggoo.member.dto.response;

public record EmailCheckResponse(
        String email,
        boolean exists
) {
    public static EmailCheckResponse of(String email, boolean exists) {
        return new EmailCheckResponse(email, exists);
    }
}
