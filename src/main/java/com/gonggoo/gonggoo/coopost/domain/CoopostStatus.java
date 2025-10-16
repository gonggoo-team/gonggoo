package com.gonggoo.gonggoo.coopost.domain;

public enum CoopostStatus {
    OPEN,      // 모집 중
    CLOSED,    // 마감
    COMPLETED, // 공동구매 완료/거래 종료
    CANCELED,   // 취소

//    DELETED    Status로 관리가 아니라 DeletedAt으로 관리하는 것으로 변경
}
