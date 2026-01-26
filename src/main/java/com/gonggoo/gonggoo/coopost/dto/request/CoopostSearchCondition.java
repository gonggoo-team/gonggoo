package com.gonggoo.gonggoo.coopost.dto.request;


import com.gonggoo.gonggoo.coopost.domain.CoopostCategory;
import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import lombok.Data;

import java.util.List;

@Data

public class CoopostSearchCondition {
    //기본 검색
    private String keyword;
    private CoopostCategory category;
    private String location;

    //필터 (0번 필터->모든 검색에서 적용될 수 있도록)

    // 가격 범위
    private Integer minPrice;
    private Integer maxPrice;

    // 모집 슬롯
    private List<String> slots;

    // 상태
    private List<CoopostStatus> statuses;
    private Boolean excludeCompleted; // 모집 완료 제외

    private Boolean deadlineToday; // [E 3-1] 오늘 마감

    //정렬, 인기글 필터
    private String sortBy; // "LATEST"(기본), "OLDEST", "POPULAR", "DEADLINE"
    private String period; // "WEEKLY", "MONTHLY" (인기글 집계 기간)
}
