package com.gonggoo.gonggoo.global.handler;

import static com.gonggoo.gonggoo.global.response.ErrorCode.SERVER_ERROR;

import com.gonggoo.gonggoo.global.exception.NeighborsException;
import com.gonggoo.gonggoo.global.response.ApiResponse;
import com.gonggoo.gonggoo.global.response.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(NeighborsException.class)
    public ResponseEntity<ApiResponse<Void>> handleAppException(NeighborsException e) {
        ErrorCode errorCode = e.getErrorCode();
        return ResponseEntity.status(errorCode.getHttpStatus())
                .body(ApiResponse.error(errorCode));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        log.error("Unhandled Exception occurred: ", e);

        NeighborsException neighborsException =
                new NeighborsException(SERVER_ERROR);
        ErrorCode errorCode = neighborsException.getErrorCode();
        return ResponseEntity.status(errorCode.getHttpStatus())
                .body(ApiResponse.error(errorCode));
    }

}
