package com.gonggoo.gonggoo.security.writer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gonggoo.gonggoo.global.response.ApiResponse;
import com.gonggoo.gonggoo.global.response.ErrorCode;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class SecurityErrorResponseWriter {
    private final ObjectMapper objectMapper; // @Bean으로 이미 등록돼 있다고 가정

    public void writeError(HttpServletResponse res, ErrorCode errorCode) throws IOException {
        res.setStatus(errorCode.getHttpStatus().value());
        res.setContentType("application/json;charset=UTF-8");

        ApiResponse<Void> body = ApiResponse.error(errorCode);

        String json = objectMapper.writeValueAsString(body);
        res.getWriter().write(json);
    }
}
