package com.gonggoo.gonggoo.member.dto.response;

public record PhoneNumberCheckResponse(
        String phoneNumber,
        boolean exists
) {
    public static PhoneNumberCheckResponse of(String phoneNumber, boolean exists) {
        return new PhoneNumberCheckResponse(phoneNumber, exists);
    }
}
