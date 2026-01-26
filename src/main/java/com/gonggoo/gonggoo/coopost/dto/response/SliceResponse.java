package com.gonggoo.gonggoo.coopost.dto.response;

import lombok.Value;
import org.springframework.data.domain.Slice;
import java.util.List;
import java.util.function.Function;

@Value
public class SliceResponse<T> {
    List<T> content;
    int size;
    int number; // 현재 페이지 번호 (Slice에서도 제공)
    boolean hasNext;

    // Slice 객체와 매핑 함수를 받아 DTO를 생성하는 정적 메서드
    public static <E, R> SliceResponse<R> of(Slice<E> slice, Function<E, R> mapper) {
        return new SliceResponse<>(
                slice.map(mapper).getContent(),
                slice.getSize(),
                slice.getNumber(),
                slice.hasNext()
        );
    }
}