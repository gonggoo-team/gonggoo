package com.gonggoo.gonggoo.scrap.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;


public record ScrapCreateRequest (
        UUID coopostId
) {}