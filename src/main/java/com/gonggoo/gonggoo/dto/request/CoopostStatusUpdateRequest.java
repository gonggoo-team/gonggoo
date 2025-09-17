package com.gonggoo.gonggoo.dto.request;

import com.gonggoo.gonggoo.domain.CoopostStatus;
import lombok.Data;

@Data
public class CoopostStatusUpdateRequest {
    private CoopostStatus status;
}