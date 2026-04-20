package com.gonggoo.gonggoo.auth.oauth;

import com.gonggoo.gonggoo.auth.domain.RegistrationProvider;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import com.gonggoo.gonggoo.global.response.ErrorCode;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class OAuthClientRegistry {

    private final Map<RegistrationProvider, OAuthClient> clients;

    public OAuthClientRegistry(List<OAuthClient> clientList) {
        this.clients = clientList.stream()
                .collect(Collectors.toUnmodifiableMap(OAuthClient::getProvider, Function.identity()));
    }

    public OAuthClient get(RegistrationProvider provider) {
        OAuthClient client = clients.get(provider);
        if (client == null) {
            throw new NeighborsException(ErrorCode.UNSUPPORTED_OAUTH_PROVIDER);
        }
        return client;
    }
}
