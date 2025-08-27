package com.gonggoo.gonggoo.dto.request;

import com.example.app.domain.CoopostStatus;
import lombok.Data;

@Data
public class CoopostStatusUpdateRequest {
    private CoopostStatus status;
}