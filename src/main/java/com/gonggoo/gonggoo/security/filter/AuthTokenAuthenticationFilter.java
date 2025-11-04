package com.gonggoo.gonggoo.security.filter;

import static com.gonggoo.gonggoo.global.response.ErrorCode.BLACKLISTED_TOKEN;

import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import com.gonggoo.gonggoo.auth.service.RedisTokenBlackListService;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import com.gonggoo.gonggoo.global.response.ErrorCode;
import com.gonggoo.gonggoo.security.writer.SecurityErrorResponseWriter;
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
    private final SecurityErrorResponseWriter securityErrorResponseWriter;

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String accessToken = jwtTokenProvider.resolveToken(req);

            if (redisTokenBlackListService.isContainToken(accessToken)) {
                throw new NeighborsException(BLACKLISTED_TOKEN);
            }
            log.debug("AccessToken : " + accessToken);
            if (accessToken != null && jwtTokenProvider.verifyToken(accessToken)) {
                Authentication authentication = jwtTokenProvider.getAuthentication(accessToken);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (NeighborsException e) {
            log.debug("Auth failure: {}", e.getMessage());
            SecurityContextHolder.clearContext();
            securityErrorResponseWriter.writeError(res, e.getErrorCode());
        } catch (Exception e) {
            log.error("Unexpected auth filter error: {}", e.getMessage(), e);
            SecurityContextHolder.clearContext();
            securityErrorResponseWriter.writeError(res, ErrorCode.SERVER_ERROR);
        }
        filterChain.doFilter(req, res);
    }
}
