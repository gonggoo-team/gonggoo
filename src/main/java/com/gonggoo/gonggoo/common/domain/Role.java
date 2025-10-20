package com.gonggoo.gonggoo.common.domain;

public enum Role {
    USER, ADMIN;

    public String authority() {
        return "ROLE_" + name();
    }
}
