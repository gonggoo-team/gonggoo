package com.gonggoo.gonggoo.auth.service;


import java.util.List;
import org.springframework.stereotype.Service;

@Service
public interface RedisTokenBlackListStore {
    void addTokenToList(String value);
    boolean isContainToken(String value);
    List<Object> getTokenBlackList();
    void removeToken(String value);
}
