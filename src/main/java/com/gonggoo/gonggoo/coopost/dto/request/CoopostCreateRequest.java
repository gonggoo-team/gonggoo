package com.gonggoo.gonggoo.coopost.dto.request;

import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CoopostCreateRequest {
    // 임시로 헤더 대신 바디로 authorId 받도록 (JWT 붙이면 제거)
    //private int authorId;

    @NotBlank(message = "제목은 필수 입력 항목입니다.")
    @Size(max = 120, message = "제목은 최대 120자까지 입력 가능합니다.")
    private String title;

    @NotBlank(message = "내용은 필수 입력 항목입니다.")
    private String content;

    @NotNull
    @Positive(message= "단위 가격은 0보다 커야 합니다. ")
    private BigDecimal pricePerUnit;

    @NotNull
    @Min(value = 1, message = "최소 참여 인원은 1명 이상이어야 합니다.")
    private Integer minParticipants;

    @NotNull
    @Max(value = 100, message = "최대 참여 인원은 100명 이하이어야 합니다.")
    private Integer maxParticipants;


    @NotNull
    private CoopostCategory category;

    @NotBlank(message = "위치는 필수 입력 항목입니다.")
    private String location;

    @NotNull
    private LocalDateTime deadlineAt;
}