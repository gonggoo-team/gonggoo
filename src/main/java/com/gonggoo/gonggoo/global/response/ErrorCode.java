package com.gonggoo.gonggoo.global.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 사용자가 존재하지 않습니다.", "User 엔티티가 db 안에 존재하지 않습니다");

    private final HttpStatus httpStatus;
    private final String message;
    private final String reason;

}
