package com.gonggoo.gonggoo.security.handler;

import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import com.gonggoo.gonggoo.auth.service.RedisTokenBlackListService;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import com.gonggoo.gonggoo.global.response.ErrorCode;
import com.gonggoo.gonggoo.security.writer.SecurityErrorResponseWriter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomLogoutHandler implements LogoutHandler {


    private final RedisTokenBlackListService redisTokenBlackListService;
    private final JwtTokenProvider jwtTokenProvider;
    private final SecurityErrorResponseWriter securityErrorResponseWriter;

    @Override
    public void logout(HttpServletRequest req, HttpServletResponse res, Authentication authentication) {
        try {
            String token = jwtTokenProvider.resolveToken(req);

            log.debug("accessToken : " + token);
            if (!redisTokenBlackListService.isContainToken(token)) {
                redisTokenBlackListService.addTokenToList(token);
                List<Object> blackList = redisTokenBlackListService.getTokenBlackList();
                log.debug("blackList : " + blackList);
            }
        } catch (NeighborsException e) {
            log.warn("Logout failed: {}", e.getMessage());
            try {
                securityErrorResponseWriter.writeError(res, e.getErrorCode());
            } catch (IOException ioEx) {
                log.error("Failed to write logout error response: {}", ioEx.getMessage(), ioEx);
            }
        } catch (Exception e) {
            log.error("Unexpected logout error: {}", e.getMessage(), e);
            try {
                securityErrorResponseWriter.writeError(res, ErrorCode.SERVER_ERROR);
            } catch (IOException ioEx) {
                log.error("Failed to write logout error response: {}", ioEx.getMessage(), ioEx);
            }
        }
    }
}
