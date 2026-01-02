package com.gonggoo.gonggoo.global.handler;

import com.gonggoo.gonggoo.global.exception.NeighborsException;
import java.nio.charset.StandardCharsets;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.web.socket.messaging.StompSubProtocolErrorHandler;

public class StompProtocolExceptionHandler extends StompSubProtocolErrorHandler {
    @Override
    public Message<byte[]> handleClientMessageProcessingError(Message<byte[]> clientMessage, Throwable ex) {
        if (ex.getCause() instanceof NeighborsException) {
            return createErrorMessage("토큰 인증에 실패했습니다.");
        }
        return super.handleClientMessageProcessingError(clientMessage, ex);
    }

    private Message<byte[]> createErrorMessage(String errMsg) {
        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.ERROR);
        accessor.setMessage(errMsg);
        accessor.setLeaveMutable(true);
        return MessageBuilder.createMessage(errMsg.getBytes(StandardCharsets.UTF_8), accessor.getMessageHeaders());
    }
}
