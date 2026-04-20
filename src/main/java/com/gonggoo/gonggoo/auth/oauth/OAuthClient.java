package com.gonggoo.gonggoo.auth.oauth;

import com.gonggoo.gonggoo.auth.domain.RegistrationProvider;

public interface OAuthClient {

    RegistrationProvider getProvider();

    OAuthUserInfo fetchUserInfo(String code);
}
