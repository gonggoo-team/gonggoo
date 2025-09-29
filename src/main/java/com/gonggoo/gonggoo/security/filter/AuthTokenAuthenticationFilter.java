package com.gonggoo.gonggoo.security.filter;

import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import com.gonggoo.gonggoo.auth.service.RedisTokenBlackListService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@RequiredArgsConstructor
public class AuthTokenAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTokenBlackListService redisTokenBlackListService;

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String accessToken = jwtTokenProvider.resolveToken(req);

            if (redisTokenBlackListService.isContainToken(accessToken)) {
                //TODO : 공통 예외로 수정
                throw new Exception("블랙리스트에 포함된 토큰으로 접근중 !!");
            }
            log.debug("AccessToken 1 : " + accessToken);
            if (accessToken != null && jwtTokenProvider.validateToken(accessToken)) {
                Authentication authentication = jwtTokenProvider.getAuthentication(accessToken);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            log.debug("Error : " + e.getMessage());
            SecurityContextHolder.clearContext();
        }
        filterChain.doFilter(req, res);
    }
}
