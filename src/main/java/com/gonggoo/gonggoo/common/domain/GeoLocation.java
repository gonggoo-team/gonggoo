package com.gonggoo.gonggoo.common.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@Embeddable
@AllArgsConstructor
public class GeoLocation {

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    protected GeoLocation() {}
}
