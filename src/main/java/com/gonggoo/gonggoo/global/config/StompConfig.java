package com.gonggoo.gonggoo.global.config;

import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import com.gonggoo.gonggoo.global.handler.StompProtocolExceptionHandler;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Slf4j
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class StompConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("*");
        registry.setErrorHandler(new StompProtocolExceptionHandler());
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        //토픽 구독을 위한 접두사
        registry.enableSimpleBroker("/sub", "/queue");
        //어플리케이션에 요청을 보낼 때 작성해야 하는 접두사
        registry.setApplicationDestinationPrefixes("/pub");
        //사용자 세션 접근을 위한 접두사
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (accessor == null) {
                    return message; // 또는 null (끊기게)
                }

                StompCommand cmd = accessor.getCommand();
                if (cmd == null) {
                    return message;
                }

                if (StompCommand.CONNECT.equals(cmd)) {
                    String rawToken = getToken(accessor);
                    String token = resolveToken(rawToken);
                    log.info("[WS] CONNECT tokenPresent={}", token != null && !token.isBlank());

                    if (token == null || token.isBlank()) {
                        return null;
                    }

                    jwtTokenProvider.verifyToken(token);
                    Authentication authentication = jwtTokenProvider.getAuthentication(token);

                    accessor.setUser(authentication);
                }
                return message;
            }
        });
    }

    private String getToken(StompHeaderAccessor accessor) {
        List<String> nativeHeader = accessor.getNativeHeader("Authorization");
        log.debug("nativeHeader : {}", nativeHeader);
        if (nativeHeader == null || nativeHeader.isEmpty()) return null;

        String token = nativeHeader.get(0);

        return (token == null) ? null : token;
    }

    private String resolveToken(String rawToken) {
        if (rawToken == null) return null;
        if (rawToken.startsWith("Bearer ")) return rawToken.substring(7);
        return rawToken;
    }
}
