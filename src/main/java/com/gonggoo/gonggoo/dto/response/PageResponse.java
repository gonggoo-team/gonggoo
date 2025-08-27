package com.gonggoo.gonggoo.dto.response;



import lombok.Value;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

@Value
public class PageResponse<T> {
    List<T> content;
    int page;
    int size;
    long totalElements;
    int totalPages;
    boolean first;
    boolean last;

    public static <E, R> PageResponse<R> of(Page<E> page, Function<E, R> mapper) {
        return new PageResponse<>(
                page.map(mapper).getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }
}