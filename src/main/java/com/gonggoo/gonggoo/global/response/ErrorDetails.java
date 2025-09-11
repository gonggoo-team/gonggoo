package com.gonggoo.gonggoo.global.response;

import lombok.Getter;

@Getter
public class ErrorDetails {

    private final String code;
    private final String reason;

    private ErrorDetails(String code, String reason) {
        this.code = code;
        this.reason = reason;
    }

    public static ErrorDetails of(ErrorCode errorCode) {
        return new ErrorDetails(errorCode.name(), errorCode.getReason());
    }

}
