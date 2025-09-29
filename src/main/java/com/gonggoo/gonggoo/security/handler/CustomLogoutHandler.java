package com.gonggoo.gonggoo.security.handler;

import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import com.gonggoo.gonggoo.auth.service.RedisTokenBlackListService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomLogoutHandler implements LogoutHandler {


    private final RedisTokenBlackListService redisTokenBlackListService;

    private final JwtTokenProvider jwtTokenProvider;

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
        } catch (ExpiredJwtException e) {
            try {
                log.error("ExpiredJwtException : {}", e.getMessage());
                //공통 response api 추가
            } catch (IOException exception) {
                log.error("IOException : {}", exception.getMessage());
            }
        }
    }
}
