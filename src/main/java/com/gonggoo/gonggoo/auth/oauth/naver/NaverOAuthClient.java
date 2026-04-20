package com.gonggoo.gonggoo.auth.oauth.naver;

import com.gonggoo.gonggoo.auth.domain.RegistrationProvider;
import com.gonggoo.gonggoo.auth.oauth.OAuthClient;
import com.gonggoo.gonggoo.auth.oauth.OAuthUserInfo;
import com.gonggoo.gonggoo.global.exception.NeighborsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import static com.gonggoo.gonggoo.global.response.ErrorCode.NAVER_USER_INFO_NOT_FOUND;

@Slf4j
@Component
@RequiredArgsConstructor
public class NaverOAuthClient implements OAuthClient {

    private final NaverProps props;
    private final RestTemplate restTemplate;

    @Override
    public RegistrationProvider getProvider() {
        return RegistrationProvider.NAVER;
    }

    @Override
    public OAuthUserInfo fetchUserInfo(String code) {
        String accessToken = requestAccessToken(code);
        NaverUserInfoResponse raw = requestUserInfo(accessToken);
        return new OAuthUserInfo(
                RegistrationProvider.NAVER,
                raw.id(),
                raw.email(),
                raw.nickname(),
                raw.profile_image(),
                raw.mobile()
        );
    }

    private String requestAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", props.client_id());
        body.add("client_secret", props.client_secret());
        body.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<NaverTokenResponse> response = restTemplate.postForEntity(
                props.post_uri(),
                request,
                NaverTokenResponse.class
        );

        return response.getBody().access_token();
    }

    private NaverUserInfoResponse requestUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<NaverUserInfoResponse> response = restTemplate.exchange(
                    props.user_info_url(),
                    HttpMethod.GET,
                    request,
                    NaverUserInfoResponse.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new NeighborsException(NAVER_USER_INFO_NOT_FOUND);
            }
            return response.getBody();
        } catch (RestClientException e) {
            throw new NeighborsException(NAVER_USER_INFO_NOT_FOUND);
        }
    }
}
