package com.gonggoo.gonggoo.global.domain;

public enum Role {
    USER, ADMIN;

    public String authority() {
        return "ROLE_" + name();
    }
}
