package com.gonggoo.gonggoo.global.exception;

import com.gonggoo.gonggoo.global.response.ErrorCode;
import lombok.Getter;

@Getter
public class NeighborsException extends RuntimeException{

    private final ErrorCode errorCode;
    private final String reason;

    public NeighborsException(final ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.reason = errorCode.getReason();
    }
}
