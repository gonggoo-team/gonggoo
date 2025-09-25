package com.gonggoo.gonggoo.coopost.dto.request;

import com.gonggoo.gonggoo.coopost.domain.CoopostStatus;
import lombok.Data;

@Data
public class CoopostStatusUpdateRequest {
    private CoopostStatus status;
}