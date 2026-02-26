package com.gonggoo.gonggoo.security.config;

import com.gonggoo.gonggoo.auth.jwt.JwtTokenProvider;
import com.gonggoo.gonggoo.auth.service.RedisTokenBlackListService;
import com.gonggoo.gonggoo.security.filter.AuthTokenAuthenticationFilter;
import com.gonggoo.gonggoo.security.handler.CustomAccessDeniedHandler;
import com.gonggoo.gonggoo.security.handler.CustomAuthenticationEntryPoint;
import com.gonggoo.gonggoo.security.handler.CustomLogoutHandler;
import com.gonggoo.gonggoo.security.writer.SecurityErrorResponseWriter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private static final String[] PERMIT_URLS = {
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/swagger-ui.html",
            "/ws/**",
            "/api/v1/notification/**",
            "/api/device/**",
            "/api/auth/**",
            "/api/coopost/v1/**",
    };
    private static final String[] PERMIT_POST_METHOD_URLS = {
            "/api/member/v1/signup",
            "/api/auth/v1/login"
    };
    private static final String[] PERMIT_GET_METHOD_URLS = {
            "/api/member/v1/check-email/**",
            "/api/member/v1/check-nickname/**"
    };

    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTokenBlackListService redisTokenBlackListService;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;
    private final CustomLogoutHandler customLogoutHandler;
    private final SecurityErrorResponseWriter securityErrorResponseWriter;

    @Bean
    public SecurityFilterChain securityFilterChain(final HttpSecurity http) throws Exception {
        return http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PERMIT_URLS).permitAll()
                        .requestMatchers(HttpMethod.POST, PERMIT_POST_METHOD_URLS).permitAll()
                        .requestMatchers(HttpMethod.GET, PERMIT_GET_METHOD_URLS).permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/member/**").hasAnyRole("ADMIN", "USER")
                        .anyRequest().authenticated())
                .addFilterBefore(new AuthTokenAuthenticationFilter(jwtTokenProvider, redisTokenBlackListService, securityErrorResponseWriter),
                        UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(eh -> eh
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .logout(logout -> logout
                        .logoutUrl("/api/auth/v1/logout")
                        .addLogoutHandler(customLogoutHandler)
                        .logoutSuccessHandler(this::handleLogoutSuccess))
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private void handleLogoutSuccess(HttpServletRequest req, HttpServletResponse res, Authentication auth) {
        res.setStatus(HttpServletResponse.SC_OK);
    }
}
