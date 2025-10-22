package com.gonggoo.gonggoo.global.response;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ApiResponse<T> {

    private final int status;
    private final String message;
    private final T data;
    private final ErrorDetails errorDetails;

    private  ApiResponse(int status, String message, T data, ErrorDetails errorDetails) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.errorDetails = errorDetails;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(HttpStatus.OK.value(), "OK", data, null);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(HttpStatus.OK.value(), message, data, null);
    }

    public static <T> ApiResponse<T> success(HttpStatus status, String message, T data) {
        return new ApiResponse<>(status.value(), message, data, null);
    }

    public static <T> ApiResponse<T> error(ErrorCode errorCode) {
        return new ApiResponse<>(errorCode.getHttpStatus().value(),
                errorCode.getMessage(),
                null,
                ErrorDetails.of(errorCode));
    }

}
