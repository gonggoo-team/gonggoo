package com.gonggoo.gonggoo.global.handler;

import static com.gonggoo.gonggoo.global.response.ErrorCode.*;

import com.gonggoo.gonggoo.global.exception.NeighborsException;
import com.gonggoo.gonggoo.global.response.ApiResponse;
import com.gonggoo.gonggoo.global.response.ErrorCode;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class StompGlobalExceptionHandler {
    @MessageExceptionHandler(NeighborsException.class)
    @SendToUser("/queue/errors")
    public ResponseEntity<ApiResponse<Void>> handleMessageNeighborsException(NeighborsException e) {
        ErrorCode errorCode = e.getErrorCode();
        return ResponseEntity.status(errorCode.getHttpStatus())
                .body(ApiResponse.error(errorCode));
    }

    @MessageExceptionHandler(Exception.class)
    @SendToUser("/queue/errors")
    public ResponseEntity<ApiResponse<Void>> handleMessageException(Exception e) {
        NeighborsException neighborsException = new NeighborsException(SERVER_ERROR);
        ErrorCode errorCode = neighborsException.getErrorCode();
        return ResponseEntity.status(errorCode.getHttpStatus())
                .body(ApiResponse.error(errorCode));
    }

}
