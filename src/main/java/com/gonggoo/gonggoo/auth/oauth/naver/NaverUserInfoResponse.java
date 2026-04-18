package com.gonggoo.gonggoo.auth.oauth.naver;

public record NaverUserInfoResponse(
        String resultcode,
        String message,
        Response response
){
    public record Response(
        String email,
        String nickname,
        String profile_image,
        String id,
        String mobile
    ){
    }

    public String email() {
        return response().email();
    }

    public String nickname() {
        return response().nickname();
    }

    public String profile_image() {
        return response().profile_image();
    }

    public String id() {
        return response().id();
    }

    public String mobile() {
        return response().mobile();
    }
}
