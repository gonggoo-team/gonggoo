package com.gonggoo.gonggoo.security.handler;

import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import com.gonggoo.gonggoo.auth.service.RedisTokenBlackListService;
import com.gonggoo.gonggoo.common.util.RedisUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CustomLogoutHandler implements LogoutHandler {

    @Autowired
    private RedisTokenBlackListService redisTokenBlackListService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private RedisUtil redisUtil;

    @Override
    public void logout(HttpServletRequest req, HttpServletResponse res, Authentication authentication) {
        try {
            String token = jwtTokenProvider.resolveToken(req);

            if (!redisTokenBlackListService.isContainToken(token)) {
                redisTokenBlackListService.addTokenToList(token);
                List<Object> blackList = redisTokenBlackListService.getTokenBlackList();
                log.debug("blackList : " + blackList);
            }
        } catch (ExpiredJwtException e) {
            try {
                //공통 response api 추가
            } catch (IOException exception) {
                log.error("IOException : {}", exception.getMessage());
            }
        }
    }
}
