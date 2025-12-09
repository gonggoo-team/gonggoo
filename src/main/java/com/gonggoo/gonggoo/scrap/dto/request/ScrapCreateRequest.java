package com.gonggoo.gonggoo.scrap.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor
public class ScrapCreateRequest {
    private UUID coopostId;
}